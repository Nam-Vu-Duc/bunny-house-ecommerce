const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/adminController')

router.get('/create', adminController.create)
router.post('/create', adminController.created)


module.exports = router