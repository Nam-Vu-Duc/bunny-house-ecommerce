const express = require('express')
const router = express.Router()
const adminController = require('../../app/controllers/admin/adminController')
const upload = require('../../app/middleware/cloudinary');

//home
router.get('/', adminController.show)
//customer
router.get('/all-customers', adminController.allCustomers)
router.get('/all-customers/:id', adminController.customerInfo)
router.get('/create/customer', adminController.createCustomer)
router.post('/customer/created', adminController.customerCreated)
//purchase
router.get('/all-purchases', adminController.allPurchases)
router.get('/all-purchases/purchase/:id', adminController.purchaseInfo)
//order
router.get('/all-orders', adminController.allOrders)
router.get('/all-orders/:id', adminController.orderInfo)
router.put('/order-updated/:id', adminController.orderUpdated)
//store
router.get('/all-stores', adminController.allStores)
router.get('/all-stores/store/:id', adminController.storeInfo)
//brand
router.get('/all-brands', adminController.allStores)
//employees
router.get('/all-employees', adminController.allEmployees)
router.get('/all-employees/employee/:id', adminController.employeeInfo)
//product
router.get('/create/product', adminController.createProduct)
router.post('/product/created', upload.single('img'), adminController.productCreated)
router.get('/all-products', adminController.allProducts)
router.get('/updating/:id', adminController.updatingProduct)
router.put('/updated/:id', upload.single('img'), adminController.productUpdated)
router.delete('/soft-delete/:id', adminController.softDelete)
router.delete('/delete/:id', adminController.deleteProduct)
router.get('/restore/:id', adminController.restore)
router.get('/trash', adminController.trash)
//profile
router.get('/update-profile/:id', adminController.updateProfile)
router.put('/profile-updated/:id', adminController.profileUpdated)

module.exports = router