const express = require('express')
const router = express.Router()

const adminController = require('../app/controllers/adminController')

router.get('/create', adminController.create)

router.post('/created', adminController.created)

router.get('/update', adminController.update)

router.get('/updating/:id', adminController.updating)

router.put('/updated/:id', adminController.updated)

router.delete('/delete/:id', adminController.delete)

router.get('/trash', adminController.trash)

router.post('/form-actions', adminController.formActions)





module.exports = router