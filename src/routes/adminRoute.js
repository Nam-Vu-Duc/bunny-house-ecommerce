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

router.get('/', adminController.show)

router.get('/create', adminController.create)

router.post('/created', upload.single('avatar'), adminController.created)

router.get('/update', adminController.update)

router.get('/updating/:id', adminController.updating)

router.put('/updated/:id', adminController.updated)

router.delete('/soft-delete/:id', adminController.softDelete)

router.delete('/delete/:id', adminController.delete)

router.get('/restore/:id', adminController.restore)

router.get('/trash', adminController.trash)

module.exports = router