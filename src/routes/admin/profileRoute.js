const express = require('express')
const router = express.Router()
const profileController = require('../../app/controllers/admin/profileController')

router.get('/:id', profileController.updateProfile)
router.put('/profile-updated/:id', profileController.profileUpdated)

module.exports = router