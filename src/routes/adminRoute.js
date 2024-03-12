const express = require('express')
const router = express.Router()
const multer  = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads/')
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  }
})
const upload = multer({ storage })

const adminController = require('../app/controllers/adminController')

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
router.post('/created', upload.single('avatar'), adminController.productCreated)

// all items page
router.get('/all-products', adminController.allProducts)

// update item page
router.get('/updating/:id', adminController.updatingProduct)

// update item api
router.put('/updated/:id', upload.single('avatar'), adminController.productUpdated)

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