const express = require('express')
const router = express.Router()

const authenticationController = require('../app/controllers/authenticationController')

// authenticationController.index
router.get('/sign-in', authenticationController.signIn )

router.get('/sign-up', authenticationController.signUp )

module.exports = router