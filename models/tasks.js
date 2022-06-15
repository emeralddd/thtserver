const mongo = require('mongoose')
const Schema = mongo.Schema

const Task = new Schema({
        tag: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        statement: {
            type: String,
            required: true
        }
    }
)
module.exports = mongo.model('tasks',Task)