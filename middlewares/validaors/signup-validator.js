const { check, validationResult } = require('express-validator')
const User = require('../../models/User')

const signupValidator = [
    check('name')
        .isLength({ min: 1 })
        .withMessage('Name is required')
        .trim(),
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value }).select({ password: 0 })

                if (user) {
                    throw new Error('Email already in use')
                }

            } catch (error) {
                throw new Error(error.message)
            }
        })
        .withMessage('Email already in use')
        .trim(),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must have more then 6 charecters')
]

const singupValidatorHandler = (req, res, next) => {
    const result = validationResult(req)

    if (result.errors.length === 0) {
        next()
    } else {
        res.status(400).json({
            errors: result.formatWith(e => (
                { msg: e.msg }
            )).mapped()
        })
    }
}

module.exports = {
    signupValidator,
    singupValidatorHandler
}