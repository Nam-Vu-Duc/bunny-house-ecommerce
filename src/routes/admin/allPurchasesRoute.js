const express = require('express')
const router = express.Router()
const allPurchasesController = require('../../app/controllers/admin/allPurchasesController')

router.get('/', allPurchasesController.allPurchases)
router.get('/purchase/:id', allPurchasesController.purchaseInfo)

module.exports = router