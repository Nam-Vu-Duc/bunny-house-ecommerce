const express = require('express')
const router = express.Router()
const adminController = require('../app/controllers/adminController')
const upload = require('../app/middleware/cloudinary');

// home page
router.get('/', adminController.show)

// admin' orders page
router.get('/all-orders', adminController.allOrders)

// orderInfo page
router.get('/all-orders/:id', adminController.orderInfo)

// update order api
router.put('/order-updated/:id', adminController.orderUpdated)

// create item page
router.get('/create', adminController.createProduct)

// create item api
router.post('/created', upload.single('img'), adminController.productCreated)

// all items page
router.get('/all-products', adminController.allProducts)

// update item page
router.get('/updating/:id', adminController.updatingProduct)

// update item api
router.put('/updated/:id', upload.single('img'), adminController.productUpdated)

// soft delete item api
router.delete('/soft-delete/:id', adminController.softDelete)

// hard delete item api
router.delete('/delete/:id', adminController.deleteProduct)

// restore item api
router.get('/restore/:id', adminController.restore)

// deleted item page
router.get('/trash', adminController.trash)

// update profile page
router.get('/update-profile/:id', adminController.updateProfile)

//
router.put('/profile-updated/:id', adminController.profileUpdated)

module.exports = router