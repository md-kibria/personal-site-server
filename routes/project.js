const router = require('express').Router()
const { createProject, getAllProject, getSingleProject, updateProject, deleteProject } = require('../controllers/project')
const { createProjectValidator, createProjectValidatorHandler } = require('../middlewares/validaors/createProject-validator')
const upload = require('../middlewares/upload')
const authenticate = require('../middlewares/authentication')

router.post('/create', authenticate, upload.single('thumbnail'), createProjectValidator, createProjectValidatorHandler, createProject)
router.get('/', getAllProject)
router.get('/:id', getSingleProject)
router.put('/update/:id', upload.single('thumbnail'), authenticate, updateProject)
router.delete('/delete/:id', authenticate, deleteProject)

module.exports = router