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
    const {difficultyMin,difficultyMax} = req.body

    if(difficultyMin>difficultyMax || difficultyMax>999 || difficultyMin<0 || (difficultyMax % 100 !== 0) || (difficultyMin % 100 !==0)) {
        return res.status(400).json({
            success: false,
            message: WRONG_DATA
        })
    }

    try {
        const thptqgFormat = require('../data/thptqgFormat.json')
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getContest/:_id', verifyToken, async (req, res) => {
    const _id = req.params._id

    try {
        const foundContest = contests.findById(_id)
        if(!foundContest) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }

        //get all information

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

router.get('/getCContest/:_id', verifyToken, async (req, res) => {
    const _id = req.params._id

    try {
        const foundCContest = ccontests.findById(_id)
        if(!foundCContest) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }

        //get all information

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundCContest
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
        const foundContest = type ? contests.findById(_id) : ccontests.findById(_id)

        if(!foundContest) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }

        let correctAnswer=0
        let index=0
        for(let j=0; j<foundContest.task.length; j++) {
            const task=foundContest.task[j]
            for(let i=0; i<task.length; i++) {
                const foundQuestion = questions.findById(task[i])
                if(submitedAnswer[index] === foundQuestion.answer) correctAnswer++
                index++
                foundContest.task[j][i]=foundQuestion
            }
        }

        const newLog = new logs({
            username: req.executor.username,
            contest: _id,
            type,
            submitedAnswer,
            correctAnswer
        })

        await newLog.save()

        res.json({
            success: true,
            message: SUCCESS,
            payload: {
                submitedAnswer,
                contestData: foundContest,
                correctAnswer
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