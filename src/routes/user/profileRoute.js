const express = require('express')
const router = express.Router()
const profileController= require('../../app/controllers/user/profileController')

router.get('/:id', profileController.updateProfile)
router.put('/updated/:id', profileController.updatedProfile)

module.exports = router