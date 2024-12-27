const express = require('express')
const router = express.Router()
const allPurchasesController = require('../../app/controllers/admin/allPurchasesController')

router.get('/', allPurchasesController.allPurchases)

router.get('/purchase/create', allPurchasesController.purchaseCreate)
router.post('/purchase/created', allPurchasesController.purchaseCreated)

router.get('/purchase/:id', allPurchasesController.purchaseInfo)
router.put('/purchase/updated/:id', allPurchasesController.purchaseUpdate)

module.exports = router