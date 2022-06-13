require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 8080
const mongo = require('mongoose')

const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')
const publicRouter = require('./routes/public')
const teacherRouter = require('./routes/teacher')
const userRouter = require('./routes/user')

const connectDB = async () => {
    try {
        await mongo.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v96md.mongodb.net/members?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('DB Connected Successfully!')
    } catch (err) {
        if(err) {
            console.log(err.message)
            process.exit(1)
        }
    }
}

connectDB()

app.use(cors())
app.use(express.json())

app.get('/', function (req, res) {
  res.send('hello world')
})

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)
app.use('/api/teacher', teacherRouter)
app.use('/api/public', publicRouter)


//app.get('/api/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Running at ${PORT}`)
})
