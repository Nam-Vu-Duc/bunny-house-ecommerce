const express = require('express')
const router = express.Router()
const allOrdersController = require('../../app/controllers/admin/allOrdersController')

router.get('/', allOrdersController.allOrders)
router.get('/:id', allOrdersController.orderInfo)
router.put('/order-updated/:id', allOrdersController.orderUpdated)

module.exports = router