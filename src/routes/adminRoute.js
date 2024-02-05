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

// create item form
router.get('/create', adminController.create)

// create item api
router.post('/created', upload.single('avatar'), adminController.created)

// update item board
router.get('/update', adminController.update)

// update item form
router.get('/updating/:id', adminController.updating)

// update item api
router.put('/updated/:id', adminController.updated)

// soft delete item api
router.delete('/soft-delete/:id', adminController.softDelete)

// hard delete item api
router.delete('/delete/:id', adminController.delete)

// restore item api
router.get('/restore/:id', adminController.restore)

// deleted item board
router.get('/trash', adminController.trash)

// update profile form
router.get('/update-profile', adminController.updateProfile)

module.exports = router