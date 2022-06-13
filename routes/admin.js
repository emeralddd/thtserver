//Create User
//Delete User
//Edit User

//Delete Task
//Edit Task

//Delete Thematic
//Edit Thematic

require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/auth')

const questions = require('../models/questions')
const users = require('../models/users')
const tasks = require('../models/tasks')
const thematics = require('../models/thematics')
const { MISSING_DATA, ERROR_500, MISSING_PERMISSION, WRONG_DATA, SUCCESS, TAG_EXIST } = require('../VariableName')

router.post('/createTask', verifyToken, async (req, res) => {
    const {tag,label,statement} = req.body

    if(!tag || !label || !statement) {
        return res.status(400).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        const {_id} = req.executor

        let found = await tasks.findOne({tag})

        if(found) {
            return res.status(400).json({
                success: false,
                message: TAG_EXIST
            })
        }

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

        const newData = new tasks({
            tag,
            label,
            statement
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

router.post('/createThematic', verifyToken, async (req, res) => {
    const {tag,label,task} = req.body

    if(!tag || !label || !task) {
        return res.status(400).json({
            success: false,
            message: MISSING_DATA
        })
    }

    try {
        const {_id} = req.executor

        const foundThematic = await thematics.findOne({tag})

        if(foundThematic) {
            return res.status(400).json({
                success: false,
                message: TAG_EXIST
            })
        }

        // console.log(task)

        const foundTask = await tasks.findOne({tag:task})

        if(!foundTask) {
            return res.status(400).json({
                success: false,
                message: WRONG_DATA
            })
        }

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

        const newData = new thematics({
            tag,
            label,
            task
        })

        await newData.save()

        console.log(foundTask)

        foundTask.thematics.push(newData)

        await foundTask.save()

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