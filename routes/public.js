//Get User
//Get Format
//Get Lesson
//Get Themetic
//Get Task

require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST, ERROR505OR404, NOT_FOUND } = require('../VariableName')
const texts = require('../models/texts')
const lessons = require('../models/lessons')
const contests = require('../models/contests')

router.get('/getQuestion/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        const foundQuestion = await questions.findById(_id)

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

router.get('/getQuestions', async (req, res) => {
    try {
        const foundQuestion = await questions.find({})

        // console.log(foundTask)

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

router.get('/getLesson/:tag', async (req, res) => {
    const tag = req.params.tag

    try {
        // console.log(tag)

        let foundLesson = await lessons.findOne({tag}).lean()

        // console.log(foundLesson)
        
        if(!foundLesson) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundLesson.user = await users.findById(foundLesson.user).select('-password')

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

router.get('/getLessons', async (req, res) => {
    try {
        const foundLesson = await lessons.find({})

        // console.log(foundTask)

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
        const foundTask = await tasks.find({})

        // console.log(foundTask)

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

router.get('/getTask/:tag', async (req, res) => {
    const tag = req.params.tag

    try {
        let foundTask = await tasks.findOne({tag}).lean()

        if(!foundTask) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundTask.thematics = await thematics.find({task:tag})

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
        const foundThematic = await thematics.find({})

        // const foundQuestions = await questions.find({thematic:})

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

router.get('/getThematic/:tag', async (req, res) => {
    const tag = req.params.tag

    console.log(tag)

    try {
        let foundThematic = await thematics.findOne({tag}).lean()

        if(!foundThematic) {
            return res.status(404).json({
                success: false,
                message: NOT_FOUND
            })
        }
        
        foundThematic.questions = await questions.find({thematic:tag})

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
        const foundContest = await contests.find({})

        // console.log(foundTask)

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

router.get('/zzz', async (req, res) => {
    try {
        const foundContest = await questions.updateMany({},{
            user:'admin'
        },{
            new:true
        })

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

module.exports = router