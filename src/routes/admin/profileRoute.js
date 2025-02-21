const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const profileController = require('../../app/controllers/admin/profileController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/'             , profileController.updateProfile)
router.put('/updated/:id'  , profileController.profileUpdated)

router.post('/data/profile', profileController.getProfile)

module.exports = router