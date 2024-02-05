const express = require('express')
const router = express.Router()

const authenticationController = require('../app/controllers/authenticationController')

// authenticationController.index

router.get('/sign-in', authenticationController.signIn )

router.post('/checking-account', authenticationController.checkingAccount )

router.get('/sign-up', authenticationController.signUp )

router.post('/creating-account',  authenticationController.creatingAccount )


module.exports = router