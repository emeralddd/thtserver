const mongo = require('mongoose')
const Schema = mongo.Schema

const User = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        admin: {
            type: Number,
            required: true
        },
        fullName: {
            type: String,
        },
        dateCreated: {
            type: Date,
            default: Date.now(),
            required: true
        }
    }
)
module.exports = mongo.model('users',User)