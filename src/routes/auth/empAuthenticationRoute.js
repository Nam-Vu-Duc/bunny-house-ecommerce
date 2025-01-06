const express = require('express')
const flash = require('connect-flash');
const session = require('express-session')
const router = express.Router()
const empAuthenticationController = require('../../app/controllers/auth/empAuthenticationController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
router.use(flash())
router.get('/sign-in', empAuthenticationController.signIn )
router.post('/checking-account', empAuthenticationController.checkingAccount )

module.exports = router