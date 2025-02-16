const express = require('express')
const router = express.Router()
const allProductsController = require('../../app/controllers/user/allProductsController')

router.get('/status/:slug', allProductsController.showAllProducts)

router.get('/categories/skincare', allProductsController.showAllProducts)
router.get('/skincare/:slug', allProductsController.showAllProducts)

router.get('/categories/makeup', allProductsController.showAllProducts)
router.get('/makeup/:slug', allProductsController.showAllProducts)

router.get('/brand/:slug', allProductsController.showAllBrandType)

router.get('/:slug', allProductsController.showAllProducts)
router.get('/product/:id', allProductsController.productInfo)

router.post('/data/products', allProductsController.getProducts)

module.exports = router