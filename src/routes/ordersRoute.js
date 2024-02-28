const express = require('express')
const router = express.Router()

const orderController = require('../app/controllers/orderController')

// productController.index
router.get('/', orderController.show)

router.get('/progress/:id', orderController.ordersProgress)

router.post('/create-orders', orderController.createOrders)

module.exports = router