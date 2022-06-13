//Edit question
//Delete question

//Edit text
//Delete text

//Edit lesson
//Delete lesson

require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST, ERROR505OR404 } = require('../VariableName')
const texts = require('../models/texts')
const lessons = require('../models/lessons')
const contests = require('../models/contests')

const checkValidQuestion = async(qu) => {
    const {question,choices,answer,explanation,task,thematic,difficulty} = qu

    if(!question || !choices || !answer || !explanation || !task || !thematic || !difficulty) {
        return {
            code: 400,
            json: {
                success: false,
                message: MISSING_DATA
            }
        }
    }

    if(answer<1 || answer>4) {
        return {
            code: 400,
            json: {
                success: false,
                message: WRONG_DATA
            }
        }
    }

    try {  
        const foundTask = await tasks.findOne({tag:task})

        if(!foundTask) {
            return {
                code: 400,
                json: {
                    success: false,
                    message: WRONG_DATA
                }
            }
        }

        const foundThematic = await thematics.findOne({tag:thematic})

        if(!foundThematic) {
            return {
                code: 400,
                json: {
                    success: false,
                    message: WRONG_DATA
                }
            }
        }
        return {
            code: 200,
            json: {
                success: true
            },
            foundThematic
        }
    } catch(err) {
        return {
            code: 500,
            json: {
                success: false,
                message: ERROR505OR404
            }
        }
    }

    
}

router.post('/addQuestion', verifyToken, async (req, res) => {
    const {question,choices,answer,explanation,source,task,thematic,difficulty} = req.body

    try { 
        const questionResult = await checkValidQuestion(req.body)

        if(!questionResult.json.success) {
            return res.status(questionResult.code).json(questionResult.json)
        }
        
        const {_id} = req.executor

        const foundUser = await users.findById(_id)

        if(!foundUser) {
            return res.status(400).json({
                success: false,
                message: WRONG_ACCOUNT
            })
        }

        if(foundUser.admin<2) {
            return res.status(403).json({
                success: false,
                message: MISSING_PERMISSION
            })
        }

        const newData = new Questions({
            question,
            choices,
            answer,
            explanation,
            source,
            task,
            thematic,
            difficulty,
            user: foundUser
        })

        await newData.save()

        const foundThematic = questionResult.foundThematic

        foundThematic.questions.push(newData)

        await foundThematic.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: newData
        })

    } catch(err) {
        res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.post('/addText', verifyToken, async (req, res) => {
    const {text,questions,source,task,difficulty} = req.body

    if(!text || !questions || !task || !difficulty) {
        // console.log('abc')
        return res.status(400).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        for(const qu of questions) {
            const questionResult = await checkValidQuestion(qu)
    
            if(!questionResult.json.success) {
                return res.status(questionResult.code).json(questionResult.json)
            }
        }

        const foundTask = await tasks.findOne({task})

        if(!foundTask) {
            return res.status(400).json({
                success: false,
                message: WRONG_DATA
            })
        }

        const {_id} = req.executor

        const foundUser = await users.findById(_id)

        if(!foundUser) {
            return res.status(400).json({
                success: false,
                message: WRONG_ACCOUNT
            })
        }

        if(foundUser.admin<2) {
            return res.status(403).json({
                success: false,
                message: MISSING_PERMISSION
            })
        }

        // console.log(questions)

        let questionsArray = []
        
        for(let qu of questions) {
            const foundThematic = await thematics.findOne({tag:qu.thematic})

            // console.log(qu)

            qu.user = foundUser

            const newData = new Questions(qu)
    
            await newData.save()
    
            foundThematic.questions.push(newData)

            questionsArray.push(newData)
    
            await foundThematic.save()
        }

        // console.log(questionsArray)

        const newData = new texts({
            text,
            questions:questionsArray,
            source,
            task,
            difficulty
        })

        await newData.save()

        

        res.json({
            success: true,
            message: SUCCESS,
            payload: newData
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.post('/addLesson', verifyToken, async (req, res) => {
    const {tag,title,content} = req.body

    if(!tag || !title || !content) {
        return res.status(400).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try { 
        const foundLesson = await lessons.findOne({tag})

        if(foundLesson) {
            return res.status(400).json({
                success: false,
                message: TAG_EXIST
            })
        }
        
        const {_id} = req.executor

        const foundUser = await users.findById(_id)

        if(!foundUser) {
            return res.status(400).json({
                success: false,
                message: WRONG_ACCOUNT
            })
        }

        if(foundUser.admin<2) {
            return res.status(403).json({
                success: false,
                message: MISSING_PERMISSION
            })
        }

        const newData = new lessons({
            tag,
            title,
            content,
            user: foundUser
        })

        await newData.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: newData
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.post('/addContest', verifyToken, async (req, res) => {
    const {task,tag,title,time,difficulty} = req.body

    if(!task || !tag || !title || !difficulty ||!time) {
        return res.status(400).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        const foundContest = await contests.findOne({tag})

        if(foundContest) {
            return res.status(400).json({
                success: false,
                message: TAG_EXIST
            })
        }

        const {_id} = req.executor

        const foundUser = await users.findById(_id)

        if(!foundUser) {
            return res.status(400).json({
                success: false,
                message: WRONG_ACCOUNT
            })
        }

        if(foundUser.admin<2) {
            return res.status(403).json({
                success: false,
                message: MISSING_PERMISSION
            })
        }

        const newData = new contests({
            tag,
            title,
            time,
            difficulty,
            task
        })

        await newData.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: newData
        })

    } catch(err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

module.exports = router