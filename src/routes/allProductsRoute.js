const express = require('express')
const router = express.Router()

const allProductsController = require('../app/controllers/allProductsController')

router.get('/all-brands', allProductsController.showAllBrands)

router.get('/all-brands/:slug', allProductsController.showBrand)

router.get('/', allProductsController.showAllProducts)

router.get('/:slug', allProductsController.showAllProducts)

router.get('/skincare/:slug', allProductsController.showSkincare)

router.get('/makeup/:slug', allProductsController.showMakeUp)



module.exports = router