const express = require('express')
const flash = require('connect-flash');
const session = require('express-session')
const router = express.Router()
const allOrderController = require('../../app/controllers/user/allOrderController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/', allOrderController.show)
router.get('/checking', allOrderController.ordersChecking)
router.get('/checking/:id', allOrderController.orderChecked)
router.post('/create-orders', allOrderController.createOrders)
router.get('/order/:id', allOrderController.orderInfo)
router.get('/order/rate/:id', allOrderController.rateOrder)

module.exports = router