const router = require('express').Router()
const {signupUser, getAllUsers, getSingleUsers, loginUser, updateUser, deleteUser} = require('../controllers/user')
const {signupValidator, singupValidatorHandler} = require('../middlewares/validaors/signup-validator')
const {loginValidator, loginValidatorHandler} = require('../middlewares/validaors/login-validator')
const  authenticate = require('../middlewares/authentication')

router.post('/signup', signupValidator, singupValidatorHandler, signupUser)
router.post('/login', loginValidator, loginValidatorHandler, loginUser)
router.get('/', getAllUsers)
router.get('/:id', getSingleUsers)
router.put('/update', authenticate, updateUser)
router.delete('/delete', authenticate, deleteUser)

module.exports = router