const express = require('express')
const router = express.Router()
const allProductsController = require('../../app/controllers/user/allProductsController')

router.get('/', allProductsController.showAllProducts)
router.get('/:slug', allProductsController.showAllProducts)
router.get('/skincare/:slug', allProductsController.showAllSkincare)
router.get('/makeup/:slug', allProductsController.showAllMakeUp)
router.get('/product/:id', allProductsController.productInfo)

module.exports = router