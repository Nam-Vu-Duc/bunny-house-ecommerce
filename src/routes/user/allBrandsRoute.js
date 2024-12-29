const express = require('express')
const router = express.Router()
const allBrandsController = require('../../app/controllers/user/allBrandsController')

router.get('/', allBrandsController.showAllBrands)
router.get('/brand/:id', allBrandsController.brandInfo)

module.exports = router