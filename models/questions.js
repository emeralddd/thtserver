const mongo = require('mongoose')
const Schema = mongo.Schema

const Question = new Schema({
        question: {
            type: String,
            required:true
        },
        choices: {
            type: Array,
            required:true
        },
        answer: {
            type: Number,
            required:true
        },
        explanation: {
            type: String
        },
        source: {
            type: String,
        },
        task: {
            type: String,
            required:true
        },
        thematic: {
            type: String,
            required:true
        },
        difficulty: {
            type: Number,
            required:true
        },
        text: {
            type: String
        },
        user: {
            type: String,
            required:true
        }
    }
)
module.exports = mongo.model('questions',Question)