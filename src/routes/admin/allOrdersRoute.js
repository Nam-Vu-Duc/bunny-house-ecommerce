const express = require('express')
const router = express.Router()
const allOrdersController = require('../../app/controllers/admin/allOrdersController')

router.get('/', allOrdersController.allOrders)

router.get('/order/create', allOrdersController.orderCreate)
router.post('/order/created', allOrdersController.orderCreated)

router.get('/order/:id', allOrdersController.orderInfo)
router.put('/order/updated/:id', allOrdersController.orderUpdate)

module.exports = router