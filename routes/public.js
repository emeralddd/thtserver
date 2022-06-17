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
        
        const foundText = foundQuestion.text? await texts.findById(foundQuestion.text).select('text source').lean() : {
            text:'',
            source:''
        }

        foundQuestion.text=foundText

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

// router.get('/zzz/:task/:thematic/:diff', async (req, res) => {
//     try {
//         const abc = [
//             '',
//             '62ac19b3b1acdb8b01a21241',
//             '62ac15dcb1acdb8b01a21228',
//             '62ac162ab1acdb8b01a2122c',
//             '62ac15b0b1acdb8b01a21224',
//             '',
//             '62ac1666b1acdb8b01a21230',
//             '62ac1754b1acdb8b01a2123c',
//             '62ac1689b1acdb8b01a21234',
//             '62ac16fab1acdb8b01a21238'
//         ]
//         // for(let j=1; j<5; j++)
//         const task = req.params.task
//         // const diff = req.params.diff
//         const thematic = req.params.thematic
//         const j=req.params.diff
//         // for(const te of abc)
//         // for(let k=0; k<=2; k++)
//         for(let i=0; i<10; i++) {
//             const k=0
//             if(abc[i]==='') continue
//             const newData = new questions({
//                 question: `question-${task}-${thematic}-${j*1000+i*100+k*10}`,
//                 choices: [
//                     `choice-a-${task}-${thematic}-${j*1000+i*100+k*10}`,
//                     `choice-b-${task}-${thematic}-${j*1000+i*100+k*10}`,
//                     `choice-c-${task}-${thematic}-${j*1000+i*100+k*10}`,
//                     `choice-d-${task}-${thematic}-${j*1000+i*100+k*10}`
//                 ],
//                 answer: Math.floor(Math.random()*4)+1,
//                 explanation:`explanation-${task}-${thematic}-${j*1000+i*100+k*10}`,
//                 source:'testing-system',
//                 task,
//                 thematic,
//                 difficulty:j*1000+i*100+k*10,
//                 text:abc[i],
//                 user:'admin'
//             })

//             await newData.save()

//             console.log(i)
//         }
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({
//             success: false,
//             message: ERROR_500
//         })
//     }
// })

router.get('/getTexts', async (req, res) => {
    try {
        const foundTexts = await texts.find({}).lean()
        // console.log('abc')
        res.json({
            success: true,
            message: SUCCESS,
            payload: foundTexts
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