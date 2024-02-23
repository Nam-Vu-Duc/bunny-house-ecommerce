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

// users' orders page
router.get('/all-orders', adminController.allOrders)

// create item page
router.get('/create', adminController.create)

// create item api
router.post('/created', upload.single('avatar'), adminController.created)

// all items page
router.get('/update', adminController.update)

// update item page
router.get('/updating/:id', adminController.updating)

// update item api
router.put('/updated/:id', upload.single('avatar'), adminController.updated)

// soft delete item api
router.delete('/soft-delete/:id', adminController.softDelete)

// hard delete item api
router.delete('/delete/:id', adminController.delete)

// restore item api
router.get('/restore/:id', adminController.restore)

// deleted item page
router.get('/trash', adminController.trash)

// update profile page
router.get('/update-profile', adminController.updateProfile)

module.exports = router