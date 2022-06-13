const mongo = require('mongoose')
const Schema = mongo.Schema

const Lesson = new Schema({
        tag: {
            type: String,
            required:true,
            unique:true
        },
        title: {
            type: String,
            required:true
        },
        content: {
            type: String,
            required:true
        },
        dateCreated: {
            type: Date,
            default: Date.now(),
            required:true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        }
    }
)
module.exports = mongo.model('lessons',Lesson)