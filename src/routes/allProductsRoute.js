const express = require('express')
const router = express.Router()

const allProductsController = require('../app/controllers/allProductsController')

// productController.index
router.get('/', allProductsController.show)

module.exports = router