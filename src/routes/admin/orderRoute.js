const express = require('express')
const router = express.Router()
const orderController = require('../../app/controllers/admin/orderController')

router.get('/', orderController.allOrders)

router.get('/order/create', orderController.orderCreate)
router.post('/order/created', orderController.orderCreated)

router.get('/order/:id', orderController.orderInfo)
router.put('/order/updated/:id', orderController.orderUpdate)

module.exports = router