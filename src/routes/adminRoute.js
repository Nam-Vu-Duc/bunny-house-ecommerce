const express = require('express')
const router = express.Router()
const adminController = require('../app/controllers/adminController')
const upload = require('../app/middleware/cloudinary');

// home page
router.get('/', adminController.show)

// admin' customers page
router.get('/all-customers', adminController.allCustomers)

// admin' orders page
router.get('/all-customers/:id', adminController.customerInfo)

// admin' customer page
router.get('/create/customer', adminController.createCustomer)

// create customer api
router.post('/customer/created', adminController.customerCreated)

// admin' orders page
router.get('/all-orders', adminController.allOrders)

// orderInfo page
router.get('/all-orders/:id', adminController.orderInfo)

// update order api
router.put('/order-updated/:id', adminController.orderUpdated)

// admin' store page
router.get('/all-stores', adminController.allStores)

// admin' store page
router.get('/all-brands', adminController.allStores)

// create product page
router.get('/create/product', adminController.createProduct)

// create product api
router.post('/product/created', upload.single('img'), adminController.productCreated)

// all products page
router.get('/all-products', adminController.allProducts)

// update product page
router.get('/updating/:id', adminController.updatingProduct)

// update product api
router.put('/updated/:id', upload.single('img'), adminController.productUpdated)

// soft delete product api
router.delete('/soft-delete/:id', adminController.softDelete)

// hard delete product api
router.delete('/delete/:id', adminController.deleteProduct)

// restore product api
router.get('/restore/:id', adminController.restore)

// deleted product page
router.get('/trash', adminController.trash)

// update profile page
router.get('/update-profile/:id', adminController.updateProfile)

//
router.put('/profile-updated/:id', adminController.profileUpdated)

module.exports = router