const mongo = require('mongoose')
const Schema = mongo.Schema

const Thematic = new Schema({
        tag: {
            type: String,
            required:true
        },
        label: {
            type:String,
            required:true
        },
        questions: [{
            type: Schema.Types.ObjectId,
            ref: 'questions'
        }],
        task: {
            type: String,
            required: true
        }
    }
)
module.exports = mongo.model('thematics',Thematic)