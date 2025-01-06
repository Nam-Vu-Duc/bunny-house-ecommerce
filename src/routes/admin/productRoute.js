const express = require('express')
const router = express.Router()
const productController = require('../../app/controllers/admin/productController')
const upload = require('../../app/middleware/cloudinary');

router.get('/', productController.allProducts)
router.get('/trash', productController.trash)

router.get('/product/create', productController.createProduct)
router.post('/product/created', upload.single('img'), productController.productCreated)

router.get('/product/:id', productController.updatingProduct)
router.put('/product/updated/:id', upload.single('img'), productController.productUpdated)

router.delete('/product/soft-delete/:id', productController.softDelete)
router.delete('/product/delete/:id', productController.deleteProduct)
router.get('/product/restore/:id', productController.restore)

module.exports = router