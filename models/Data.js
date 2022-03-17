const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
    heroTitle: {
        type: String,
        required: true,
        trim: true
    },
    heroDesc: {
        type: String,
        required: true,
        trim: true
    },
    heroImg: {
        type: String,
        required: true
    },
    logo: String,
    aboutDesc: {
        type: String,
        required: true,
        trim: true
    },
    aboutImg: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    chatLink: {
        type: String,
        required: true
    }
})

const Data = mongoose.model('Data', dataSchema)

module.exports = Data