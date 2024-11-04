const express = require('express')
const flash = require('connect-flash');
const session = require('express-session')
const router = express.Router()
const allOrderController = require('../app/controllers/allOrderController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

router.use(flash())
router.get('/', allOrderController.show)
router.get('/checking', allOrderController.ordersChecking)
router.get('/checking/:id', allOrderController.orderChecked)
router.post('/create-orders', allOrderController.createOrders)
router.get('/:id', allOrderController.showOrder)

module.exports = router