const express = require('express')
const router = express.Router()
const allBrandsController = require('../../app/controllers/admin/allBrandsController')

router.get('/', allBrandsController.allBrands)
router.get('/brand/:id', allBrandsController.brandInfo)

module.exports = router