const express = require('express')
const router = express.Router()
const flash = require('connect-flash');
const session = require('express-session')
const authenticationController = require('../../app/controllers/auth/authenticationController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
router.use(flash())
router.get('/sign-in', authenticationController.signIn )
router.post('/checking-account', authenticationController.checkingAccount )

router.get('/sign-up', authenticationController.signUp )
router.post('/creating-account', authenticationController.creatingAccount )

router.get('/reset-password', authenticationController.resetPassword )
router.post('/reset-password/verifying-email', authenticationController.verifyingEmail )
router.post('/reset-password/verifying-code', authenticationController.verifyingCode )
router.post('/resetting-password', authenticationController.resettingPassword )

module.exports = router