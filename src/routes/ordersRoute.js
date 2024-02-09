const express = require('express')
const router = express.Router()

const orderController = require('../app/controllers/orderController')

// productController.index
router.get('/', orderController.show)

module.exports = router