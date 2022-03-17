const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project