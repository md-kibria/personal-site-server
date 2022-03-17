const { check, validationResult } = require('express-validator')
const User = require('../../models/User')
const bcrypt = require('bcrypt')

const loginValidator = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value }).select({ password: 0 })

                if (!user) {
                    throw Error('User not found')
                }

            } catch (error) {
                throw Error(error.message)
            }
        })
        .withMessage('User not found'),
    check('password')
        .isLength({ min: 1 })
        .withMessage('Please provide your password')
        .custom(async (value, { req }) => {
            if (value) {
                try {
                    const user = await User.findOne({ email: req.body.email })

                    if (user) {
                        const pass = await bcrypt.compare(value, user.password)
                        
                        if(!pass) {
                            throw Error('Password dose\'t match')
                        }

                    }

                } catch (error) {
                    throw Error(error.message)
                }
            }
        })
        .withMessage('Password dose\'t match')
]

const loginValidatorHandler = (req, res, next) => {
    const result = validationResult(req)

    if (result.errors.length === 0) {
        next()
    } else {
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
    loginValidator,
    loginValidatorHandler
}