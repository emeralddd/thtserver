const mongo = require('mongoose')
const Schema = mongo.Schema

const CContest = new Schema({
        username: {
            type: String,
            required:true
        },
        dateCreated: {
            type: Date,
            default: Date.now(),
            required:true
        },
        difficulty: {
            type: Number,
            required:true
        },
        title: {
            type: String,
            required: true
        },
        task: [{
            tag: String,
            text: String,
            questions: Array
        }]
    }
)
module.exports = mongo.model('ccontests',CContest)