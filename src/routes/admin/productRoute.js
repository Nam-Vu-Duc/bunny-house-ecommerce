const express = require('express')
const router = express.Router()
const productController = require('../../app/controllers/admin/productController')

router.get('/'                          , productController.allProducts)
router.get('/trash'                     , productController.trash)

router.get('/product/create'            , productController.createProduct)
router.post('/product/created'          , productController.productCreated)

router.get('/product/:id'               , productController.productInfo)
router.put('/product/updated/:id'       , productController.productUpdated)

router.delete('/product/soft-delete/:id', productController.softDelete)
router.delete('/product/delete/:id'     , productController.deleteProduct)
router.get('/product/restore/:id'       , productController.restore)

router.post('/data/products'            , productController.getProducts)
router.post('/data/product'             , productController.getProduct)
router.post('/data/filter'              , productController.getFilter)
router.post('/data/deleted-products'    , productController.getDeletedProducts)

module.exports = router