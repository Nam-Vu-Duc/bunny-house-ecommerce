const express = require('express')
const router = express.Router()
const profileController = require('../../app/controllers/admin/profileController')

router.get('/', profileController.updateProfile)
router.put('/updated/:id', profileController.profileUpdated)

module.exports = router