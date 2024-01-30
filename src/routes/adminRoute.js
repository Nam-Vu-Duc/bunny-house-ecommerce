const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/adminController')

router.get('/', adminController.show)

router.get('/create', adminController.create)

router.post('/created', adminController.created)

router.get('/update', adminController.update)

router.get('/updating/:id', adminController.updating)

router.put('/updated/:id', adminController.updated)

router.delete('/soft-delete/:id', adminController.softDelete)

router.delete('/delete/:id', adminController.delete)

router.get('/restore/:id', adminController.restore)

router.get('/trash', adminController.trash)




module.exports = router