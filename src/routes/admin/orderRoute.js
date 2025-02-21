const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const orderController = require('../../app/controllers/admin/orderController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/'                 , orderController.allOrders)

router.get('/order/create'     , orderController.orderCreate)
router.post('/order/created'   , orderController.orderCreated)

router.get('/order/:id'        , orderController.orderInfo)
router.put('/order/updated/:id', orderController.orderUpdate)

router.post('/data/orders'     , orderController.getOrders)
router.post('/data/order'      , orderController.getOrder)
router.post('/data/filter'     , orderController.getFilter)

module.exports = router