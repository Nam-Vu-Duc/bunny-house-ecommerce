const express = require('express')
const router = express.Router()

const profileController= require('../app/controllers/profileController')

router.get('/update/:id', profileController.updateProfile)

router.put('/updated/:id', profileController.updatedProfile)

router.get('/orders/:id', profileController.orders)

module.exports = router