const express = require('express')
const router = express.Router()
const homeController = require('../../app/controllers/admin/homeController')

router.get('/', homeController.show)

router.post('/data/finance'   , homeController.getFinance)
router.post('/data/brands'    , homeController.getBrands)
router.post('/data/customers' , homeController.getCustomers)
router.post('/data/employees' , homeController.getEmployees)
router.post('/data/orders'    , homeController.getOrders)
router.post('/data/products'  , homeController.getProducts)
router.post('/data/purchases' , homeController.getPurchases)
router.post('/data/stores'    , homeController.getStores)
router.post('/data/suppliers' , homeController.getSuppliers)
router.get('/data/user'      , homeController.getUser)

module.exports = router