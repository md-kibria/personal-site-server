const express = require('express')
const mongoose = require('mongoose')
const dotEnv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')

const userRouter = require('./routes/user')
const projectRouter = require('./routes/project')
const dataRouter = require('./routes/data')

const app = express()

// dot env configuration
dotEnv.config()

// passport configuration
app.use(passport.initialize())
require('./utils/passport')(passport)

// use middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// public route
app.use('/files', express.static('public/uploads'))

// root route 
app.get('/', (req, res) => {
    res.end('Hello World')
})

// routes
app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/data', dataRouter)

// connect mongodb
mongoose.connect(
    'mongodb://localhost:27017/personal-site',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log('Database is connected!')
    }
);

// app listening
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})