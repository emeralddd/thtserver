const mongo = require('mongoose')
const Schema = mongo.Schema

const Contest = new Schema({
        tag: {
            type: String,
            required:true,
            unique:true
        },
        title: {
            type: String,
            required:true
        },
        time: {
            type: Number,
            required:true
        },
        task: [{
            tag: String,
            text: String,
            questions: Array
        }]
    }
)
module.exports = mongo.model('contests',Contest)