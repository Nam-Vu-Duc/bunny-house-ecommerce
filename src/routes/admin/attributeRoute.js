const express = require('express')
const router = express.Router()
const attributeController = require('../../app/controllers/admin/attributeController')

router.get('/', attributeController.show)

router.get('/data/membership'     , attributeController.getMembership)
router.get('/data/order-status'   , attributeController.getOrderStatus)
router.get('/data/payment-method' , attributeController.getPaymentMethod)
router.get('/data/position'       , attributeController.getPosition)
router.get('/data/product-status' , attributeController.getProductStatus)

module.exports = router