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
        number: {
            type: Number
        }
    }
)
module.exports = mongo.model('texts',Text)