const express = require('express')
const router = express.Router()
const flash = require('connect-flash')
const session = require('express-session')
const supplierController = require('../../app/controllers/admin/supplierController')

router.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
router.use(flash())
router.get('/', supplierController.allSuppliers)

router.get('/supplier/create', supplierController.supplierCreate)
router.post('/supplier/created', supplierController.supplierCreated)

router.get('/supplier/:id', supplierController.supplierInfo)
router.put('/supplier/updated/:id', supplierController.supplierUpdate)

module.exports = router