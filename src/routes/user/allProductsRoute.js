const express = require('express')
const router = express.Router()
const allProductsController = require('../../app/controllers/user/allProductsController')

router.get('/', allProductsController.showAllProducts)

router.get('/skincare', allProductsController.showAllSkincare)
router.get('/skincare/:slug', allProductsController.showAllSkincareType)

router.get('/makeup', allProductsController.showAllMakeUp)
router.get('/makeup/:slug', allProductsController.showAllMakeUpType)

router.get('/brand/:slug', allProductsController.showAllBrandType)

router.get('/:slug', allProductsController.showAllStatus)
router.get('/product/:id', allProductsController.productInfo)

module.exports = router