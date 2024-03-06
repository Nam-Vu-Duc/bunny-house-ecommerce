const express = require('express')
const router = express.Router()

const allOrderController = require('../app/controllers/allOrderController')

// productController.index
router.get('/', allOrderController.show)

router.get('/checking', allOrderController.ordersChecking)

router.get('/checking/:id', allOrderController.orderChecked)

router.post('/create-orders', allOrderController.createOrders)

module.exports = router