const mongo = require('mongoose')
const Schema = mongo.Schema

const Text = new Schema({
        text: {
            type: String,
            required:true
        },
        source: {
            type: String,
        },
        task: {
            type: String,
            required:true
        },
        difficulty: {
            type: Number,
            required:true
        }
    }
)
module.exports = mongo.model('texts',Text)