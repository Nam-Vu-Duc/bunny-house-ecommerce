const express = require('express')
const router = express.Router()
const brandController = require('../../app/controllers/admin/brandController')

router.get('/', brandController.allBrands)

router.get('/brand/create', brandController.brandCreate)
router.post('/brand/created', brandController.brandCreated)

router.get('/brand/:id', brandController.brandInfo)
router.put('/brand/updated/:id', brandController.brandUpdate)

module.exports = router