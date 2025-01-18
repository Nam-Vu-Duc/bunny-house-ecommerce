const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const profileController= require('../../app/controllers/user/profileController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/info', profileController.profileInfo)
router.get('/order', profileController.orderInfo)
router.get('/rate-order', profileController.rateOrderInfo)
router.get('/feedback', profileController.feedBack)
router.put('/updated/:id', profileController.profileUpdate)

module.exports = router