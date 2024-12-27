const express = require('express')
const router = express.Router()
const allBrandsController = require('../../app/controllers/admin/allBrandsController')

router.get('/', allBrandsController.allBrands)

router.get('/brand/create', allBrandsController.brandCreate)
router.post('/brand/created', allBrandsController.brandCreated)

router.get('/brand/:id', allBrandsController.brandInfo)
router.put('/brand/updated/:id', allBrandsController.brandUpdate)

module.exports = router