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

// setup view engine
app.set('view engine', 'pug')

// dot env configuration
dotEnv.config()

// define the port number
const PORT = process.env.PORT || 8080

// passport configuration
app.use(passport.initialize())
require('./utils/passport')(passport)

// use middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// public route
app.use('/files', express.static('public/uploads'))


// routes
app.use('/api/users', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/data', dataRouter)

// root route 
app.get('/', (req, res) => {
    res.locals = {
        protocol: req.protocol,
        host: req.hostname,
        port: PORT
    }
    res.render('index', {title: 'Site Map'})
})

// 404 Error Hanle
app.use((req, res, next) => {
    res.status(404).json({
        errors: {
            common: {
                msg: 'Not found!'
            }
        }
    })
})

// Error Handle
app.use((err, req, res, next) => {
    console.log(err)
    if (res.headerSend) {
        next('There was a problem!')
    } else {
        if (err.message) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: err.message
                    }
                }
            })
        } else {
            res.status(500).json({
                errors: {
                    common: {
                        msg: 'There was a problem!'
                    }
                }
            })
        }
    }
})


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
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})