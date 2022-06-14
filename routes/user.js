require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST, ERROR505OR404, NOT_FOUND } = require('../VariableName')
const texts = require('../models/texts')
const lessons = require('../models/lessons')
const contests = require('../models/contests')
const ccontests = require('../models/ccontests')
const questions = require('../models/questions')
const logs = require('../models/logs')

router.post('/generateContest', verifyToken, async (req, res) => {
    const {difficulty} = req.body

    if(difficulty>999 || difficulty<0 || (difficulty % 100 !== 0)) {
        return res.status(400).json({
            success: false,
            message: WRONG_DATA
        })
    }

    try {
        const thptqgFormat = require('../data/thptqgFormat.json')
        const spanTasks = thptqgFormat.tasks
        let task = []

        let a=5

        for(const t of spanTasks) {
            let e = {}
            e.tag=t.tag
            e.questions=[]
            if(t.tag === 'docdientu') {
                const q = await texts.aggregate([
                    { 
                        $match: {
                            task:'docdientu',
                            difficulty: {
                                $gte: difficulty 
                            }
                        }
                    },
                    {
                        $sample: {
                            size: 1
                        }
                    }
                ])

                // console.log(difficulty)

                // console.log(q)

                e.text = q[0].text

                for(let i=0; i<q[0].questions.length; i++) {
                    q[0].questions[i]=q[0].questions[i].toString()
                }

                e.questions = q[0].questions

                // console.log(q)
                
            } else if(t.tag === 'dochieudoanvan') {
                const q = await texts.aggregate([
                    { 
                        $match: {
                            task:'dochieudoanvan',
                            difficulty: {
                                $gte: difficulty 
                            },
                            number: a
                        }
                    },
                    {
                        $sample: {
                            size: 1
                        }
                    }
                ])

                e.text = q[0].text

                for(let i=0; i<q[0].questions.length; i++) {
                    q[0].questions[i]=q[0].questions[i].toString()
                }

                e.questions = q[0].questions

                if(a===5) a=7

                // console.log(e)
            } else {
                // if(t.tag !=='phatam') continue
                for(const ec of t.thematics) {
                    for(const d of ec.detail) {
                        const q = await questions.aggregate([
                            { 
                                $match: {
                                    thematic:ec.tag,
                                    difficulty: {
                                        $gte: difficulty+d.difficulty 
                                    }
                                }
                            },
                            {
                                $sample: {
                                    size: d.number
                                }
                            }
                        ])

                        // console.log(q)

                        for(const i of q) {
                            e.questions.push(i._id.toString())
                        }
                    }
                }
            }

            task.push(e)
        }

        const contests=await ccontests.count({username: req.executor.username})
        const newContest = new ccontests({
            username: req.executor.username,
            difficulty,
            title: `${req.executor.username} #${contests+1}`,
            time: thptqgFormat.time,
            task
        })

        await newContest.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: newContest._id
        })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getContest/:tagor_id', verifyToken, async (req, res) => {
    const tagor_id = req.params.tagor_id

    try {
        let type=1
        let foundContest = await contests.findOne({tag:tagor_id}).lean()

        if(!foundContest) {
            foundContest = await ccontests.findById(tagor_id).lean()

            if(!foundContest) {
                return res.status(404).json({
                    success: false,
                    message: NOT_FOUND
                })
            }   
            type=0
        }

        let index=0

        //get all information
        for(let j=0; j<foundContest.task.length; j++) {
            const task=foundContest.task[j]
            const foundTask = await tasks.findOne({tag:task.tag}).select("statement")
            foundContest.task[j].statement = foundTask.statement
            for(let i=0; i<task.questions.length; i++) {
                const foundQuestion = await questions.findById(task.questions[i]).lean()
                
                foundQuestion.index=index
                
                foundContest.task[j].questions[i]=foundQuestion

                index++
            }
        }
        //

        foundContest.type=type

        foundContest.number=index+1

        console.log(foundContest)

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundContest
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.post('/submitContest', verifyToken, async (req, res) => {
    const {_id,submitedAnswer,type} = req.body

    if(!_id || !submitedAnswer) {
        return res.status(401).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        let foundContest = type ? await contests.findById(_id).lean() : await ccontests.findById(_id).lean()

        if(!foundContest) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }

        // console.log(submitedAnswer)

        let correctAnswer=0
        let index=0
        for(let j=0; j<foundContest.task.length; j++) {
            const task=foundContest.task[j]
            const foundTask = await tasks.findOne({tag:task.tag}).select("statement")
            foundContest.task[j].statement = foundTask.statement
            for(let i=0; i<task.questions.length; i++) {
                const foundQuestion = await questions.findById(task.questions[i]).lean()
                if(submitedAnswer[index] === foundQuestion.answer) correctAnswer++
                index++
                foundQuestion.index=index
                foundContest.task[j].questions[i]=foundQuestion
            }
        }

        const newLog = new logs({
            username: req.executor.username,
            contest: _id,
            type,
            submitedAnswer,
            correctAnswer
        })

        // await newLog.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: {
                submitedAnswer,
                contestData: foundContest,
                correctAnswer,
                number:index
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

module.exports = router