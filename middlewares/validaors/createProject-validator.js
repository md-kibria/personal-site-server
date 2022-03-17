const { check, validationResult } = require('express-validator')
const path = require('path')
const { unlink } = require('fs')

const createProjectValidator = [
    check('title')
        .isLength({ min: 1 })
        .withMessage('Title is required')
        .trim(),
    check('desc')
        .isLength({ min: 1 })
        .withMessage('Title is required')
        .trim(),
    check('thumbnail')
        .custom((value, { req }) => {
            if(!req.file) {
                throw Error('Thumbnail is required')
            }

            return true
        })
        .withMessage('Thumbnail is required'),
    check('link')
        .isLength({ min: 1 })
        .withMessage('Link is required')
]

const createProjectValidatorHandler = (req, res, next) => {
    const result = validationResult(req)

    if (result.errors.length === 0) {
        next()
    } else {

        if (req.file) {
            unlink(path.join(__dirname, `../../public/uploads/${req.file.filename}`), (err) => {
                console.log(err)
            })
        }

        res.status(400).json({
            errors: result.formatWith(e => (
                {
                    msg: e.msg
                }
            )).mapped()
        })
    }
}

module.exports = {
    createProjectValidator,
    createProjectValidatorHandler
}