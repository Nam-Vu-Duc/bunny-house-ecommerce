const express = require('express')
const router = express.Router()

const allProductsController = require('../app/controllers/allProductsController')

// productController.index
router.get('/', allProductsController.showAll)

router.get('/:slug', allProductsController.showAll)

router.get('/skincare/:slug', allProductsController.showSkincare)

router.get('/makeup/:slug', allProductsController.showMakeUp)

module.exports = router