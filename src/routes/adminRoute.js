const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/adminController')

router.get('/create', adminController.create)

router.post('/created', adminController.created)

router.get('/update', adminController.update)

router.get('/update/:id', adminController.updating)

router.put('/updated/:id', adminController.updated)


module.exports = router