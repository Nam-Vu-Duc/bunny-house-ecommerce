const express = require('express')
const flash = require('connect-flash');
const session = require('express-session')
const router = express.Router()

const authenticationController = require('../app/controllers/authenticationController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

router.use(flash())

router.get('/sign-in', authenticationController.signIn )

router.post('/checking-account', authenticationController.checkingAccount )

router.get('/sign-up', authenticationController.signUp )

router.post('/creating-account',  authenticationController.creatingAccount )

module.exports = router