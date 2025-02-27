const express = require('express')
const router = express.Router()
const homeController = require('../../app/controllers/admin/homeController')

router.get('/', homeController.show)

router.get('/home/data/brands'    , homeController.getBrands)
router.get('/home/data/customers' , homeController.getCustomers)
router.get('/home/data/employees' , homeController.getEmployees)
router.get('/home/data/orders'    , homeController.getOrders)
router.get('/home/data/products'  , homeController.getProducts)
router.get('/home/data/purchases' , homeController.getPurchases)
router.get('/home/data/stores'    , homeController.getStores)
router.get('/home/data/suppliers' , homeController.getSuppliers)

module.exports = router