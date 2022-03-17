const { createData, getData, updateData } = require('../controllers/data')
const authentication = require('../middlewares/authentication')
const breaker = require('../middlewares/breaker')
const upload = require('../middlewares/upload')

const router = require('express').Router()

router.post('/create', authentication, breaker, createData)
router.get('/', getData)
router.put('/update/:id', authentication, upload.fields([
    {
        name: 'heroImg',
        maxCount: 1
    },
    {
        name: 'aboutImg',
        maxCount: 1
    },
    {
        name: 'resume',
        maxCount: 1
    },
]), updateData)

module.exports = router