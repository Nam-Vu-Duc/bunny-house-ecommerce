const express = require('express')
const router = express.Router()

const allProductsController = require('../app/controllers/allProductsController')

// productController.index
router.get('/', allProductsController.show)

router.get('/flash-sale', allProductsController.showFlashSale)

router.get('/hot', allProductsController.showHot)



module.exports = router