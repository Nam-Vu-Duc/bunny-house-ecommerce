const express = require('express')
const router = express.Router()
const allProductsController = require('../../app/controllers/admin/allProductsController')
const upload = require('../../app/middleware/cloudinary');

router.get('/', allProductsController.allProducts)
router.get('/trash', allProductsController.trash)

router.get('/product/create', allProductsController.createProduct)
router.post('/product/created', upload.single('img'), allProductsController.productCreated)

router.get('/product/:id', allProductsController.updatingProduct)
router.put('/product/updated/:id', upload.single('img'), allProductsController.productUpdated)

router.delete('/product/soft-delete/:id', allProductsController.softDelete)
router.delete('/product/delete/:id', allProductsController.deleteProduct)
router.get('/product/restore/:id', allProductsController.restore)

module.exports = router