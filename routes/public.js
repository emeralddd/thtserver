require('dotenv').config()
const express = require('express')
const router = express.Router()

const verifyToken = require('../middleware/auth')

const questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const texts = require('../models/texts')
const lessons = require('../models/lessons')
const contests = require('../models/contests')

const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST, ERROR505OR404, NOT_FOUND } = require('../VariableName')

router.get('/getQuestions', async (req, res) => {
    try {
        const foundQuestions = await questions.find({}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundQuestions
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getQuestion/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        const foundQuestion = await questions.findById(_id).lean()

        if(!foundQuestion) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundQuestion
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getLessons', async (req, res) => {
    try {
        const foundLessons = await lessons.find({}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundLessons
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getLesson/:tag', async (req, res) => {
    const tag = req.params.tag

    try {
        const foundLesson = await lessons.findOne({tag}).lean()
        
        if(!foundLesson) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundLesson.user = await users.findById(foundLesson.user).select('username fullName').lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundLesson
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getTasks', async (req, res) => {
    try {
        const foundTasks = await tasks.find({}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundTasks
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getTask/:tag', async (req, res) => {
    const tag = req.params.tag

    try {
        const foundTask = await tasks.findOne({tag}).lean()

        if(!foundTask) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundTask.thematics = await thematics.find({task:tag}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundTask
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getThematics', async (req, res) => {
    try {
        const foundThematics = await thematics.find({}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundThematics
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getThematic/:tag', async (req, res) => {
    const tag = req.params.tag

    try {
        const foundThematic = await thematics.findOne({tag}).lean()

        if(!foundThematic) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundThematic.questions = await questions.find({thematic:tag}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundThematic
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/getContests', async (req, res) => {
    try {
        const foundContests = await contests.find({}).lean()

        res.json({
            success: true,
            message: SUCCESS,
            payload: foundContests
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: ERROR_500
        })
    }
})

router.get('/zzz', async (req, res) => {
    try {
        // const foundContest = await questions.updateMany({},{
        //     user:'admin'
        // },{
        //     new:true
        // })

        const q = await (await questions.find({task:'phatam'}).select('_id')).lean().toString()
        
        // lean()

        console.log(q)

        res.json({
            success: true,
            message: SUCCESS,
            payload: q
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