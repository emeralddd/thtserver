const mongo = require('mongoose')
const Schema = mongo.Schema

const Log = new Schema({
        username: {
            type: String,
            required:true
        },
        dateCreated: {
            type: Date,
            default: Date.now(),
            required:true
        },
        contest: {
            type: String,
            required: true
        },
        type: {
            type: Boolean,
            required: true
        },
        submitedAnswer: {
            type: Array,
            required: true
        },
        correctAnswer: {
            type: Number,
            required: true
        }
    }
)
module.exports = mongo.model('logs',Log)