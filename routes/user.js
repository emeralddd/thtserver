require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const texts = require('../models/texts')
const lessons = require('../models/lessons')
const contests = require('../models/contests')
const ccontests = require('../models/ccontests')
const logs = require('../models/logs')

const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST, ERROR505OR404, NOT_FOUND } = require('../VariableName')

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
        const task = []

        let a=5

        for(const t of spanTasks) {
            const e = {}
            e.tag=t.tag
            e.questions=[]
            e.text=''
            if(t.tag === 'docdientu' || t.tag ==='dochieudoanvan') {

                const filter = {
                    task:t.tag,
                    difficulty: {
                        $gte: difficulty
                        // $lt: t.tag ==='docdientu' ? difficulty+100 : 900
                    }
                }

                if(t.tag === 'dochieudoanvan') filter.number = a

                const q = await texts.aggregate([
                    {
                        $match: filter
                    },
                    {
                        $sample: {
                            size: 1
                        }
                    }
                ])

                // console.log(t.tag)
                // console.log(q[0]._id)

                e.text = q[0]._id.toString()

                // console.log(q[0]._id.toString())

                const q_id = await Questions.find({text:q[0]._id.toString()}).select('_id').lean()

                // console.log(q_id)

                for(let i=0; i<q_id.length; i++)
                    e.questions.push(q_id[i]._id.toString())

                // console.log(e.questions)

                if(t.tag === 'dochieudoanvan' && a===5) a=7
            } else {
                for(const ec of t.thematics) {
                    for(const d of ec.detail) {
                        const q = await Questions.aggregate([
                            { 
                                $match: {
                                    thematic:ec.tag,
                                    difficulty: {
                                        $gte: difficulty+d.difficulty,
                                        $lt: difficulty+d.difficulty+100
                                    }
                                }
                            },
                            {
                                $sample: {
                                    size: d.number
                                }
                            }
                        ])

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
        
        // console.log(foundContest)

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
            const foundTask = await tasks.findOne({tag:task.tag}).select("statement").lean()
            foundContest.task[j].statement = foundTask.statement

            if(foundContest.task[j].text) {
                foundContest.task[j].text = await texts.findById(foundContest.task[j].text).select("text source").lean()
            } else {
                foundContest.task[j].text = {
                    text:'',
                    source:''
                }
            }

            // console.log(foundContest)

            for(let i=0; i<task.questions.length; i++) {
                const foundQuestion = await Questions.findById(task.questions[i]).lean()
                
                foundQuestion.index=index
                
                foundContest.task[j].questions[i]=foundQuestion

                index++
            }
        }
        //

        foundContest.type=type

        foundContest.number=index

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
    const {_id,submitedAnswer,type,contest} = req.body

    if(!_id || !submitedAnswer) {
        return res.status(401).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        let correctAnswer=0
        let index=0
        for(let j=0; j<contest.task.length; j++) {
            const task=contest.task[j]
            for(let i=0; i<task.questions.length; i++) {
                if(submitedAnswer[index] === task.questions[i].answer) correctAnswer++
                index++
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
                contestData: contest,
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