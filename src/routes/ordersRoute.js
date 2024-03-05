const express = require('express')
const router = express.Router()

const orderController = require('../app/controllers/orderController')

// productController.index
router.get('/', orderController.show)

router.get('/checking', orderController.ordersChecking)

router.get('/checking/:id', orderController.orderChecked)

router.get('/checking/user/:id', orderController.show)

router.post('/create-orders', orderController.createOrders)

module.exports = router