/**
 * Get All User
 * Get Single User
 * Signup User
 * Login User
 * Update User
 * Delete User
 */

const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const resErr = require('../utils/resErr')

// signup user
exports.signupUser = async (req, res, next) => {
    // get data from req body
    const { name, email, password } = req.body

    try {

        // hash password
        const hashPassword = await bcrypt.hash(password, 11)

        // new user
        const newUser = new User({
            name,
            email,
            password: hashPassword
        })

        const createdUser = await newUser.save()

        if (Object.keys(createdUser).length !== 0) {

            const token = jwt.sign({
                _id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email
            }, process.env.JWT_SECRET)

            res.status(201).json({
                status: 201,
                msg: 'Signup successfully',
                token: `Bearer ${token}`,
                user: createdUser
            })
        } else {
            res.status(500).json({
                status: 500,
                msg: 'Error occured! Signup failed!'
            })
        }

    } catch (error) {
        resErr(res, error, 'Error occured! Signup failed!')
    }
}

// login user
exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email}).select({password: 0, __v: 0})

        const token = jwt.sign({
            _id: user._id,
            name: user.name,
            email: user.email
        }, process.env.JWT_SECRET)

        res.status(200).json({
            status: 200,
            msg: 'Login successfull',
            token: `Bearer ${token}`
        })

    } catch (error) {
        resErr(res, error)
    }
}

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select({ password: 0, __v: 0 })

        res.status(200).json({
            status: 200,
            msg: 'All users',
            total: users.length,
            users
        })

    } catch (error) {
        resErr(res, error)
    }
}

// get single users
exports.getSingleUsers = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.find({ _id: id }).select({ password: 0, __v: 0 })

        if(user.length === 0) {
            res.status(200).json({
                status: 200,
                msg: 'User not found'
            })
        }

        res.status(200).json({
            status: 200,
            msg: 'Single user',
            user: user[0]
        })

    } catch (error) {
        resErr(res, error)
    }
}

// update user
exports.updateUser = async (req, res) => {
    const {name, email} = req.body
    const {_id} = req.user

    try {
        const user = await User.findById(_id)

        if(!user) {
            res.status(404).json({
                status: 404,
                msg: 'User not found for update, please login again'
            })
        }

        const updatedUser = {
            name: name || user.name,
            email: email || user.email
        }

        // update user
        const newUpdatedUser = await User.findByIdAndUpdate(_id, {$set: updatedUser}, {new: true})

        res.status(200).json({
            status: 200,
            msg: 'User updated successfully',
            user: newUpdatedUser
        })

    } catch (error) {
        resErr(res, error)
    }
}

// delete user
exports.deleteUser = async (req, res) => {
    const {_id} = req.user
    try {
        const user = await User.findByIdAndDelete(_id)

        if(!user) {
            res.status(404).json({
                status: 404,
                msg: 'User is not found for delete, please login again'
            })
        }

        res.status(200).json({
            status: 200,
            msg: 'User is deleted successfully',
            user
        })

    } catch (error) {
        resErr(res, error)
    }
}