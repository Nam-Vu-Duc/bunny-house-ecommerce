const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const homeController = require('../../app/controllers/admin/homeController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/', homeController.show)

module.exports = router