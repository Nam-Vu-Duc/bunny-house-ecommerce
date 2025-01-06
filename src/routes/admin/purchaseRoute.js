const express = require('express')
const router = express.Router()
const purchaseController = require('../../app/controllers/admin/purchaseController')

router.get('/', purchaseController.allPurchases)

router.get('/purchase/create', purchaseController.purchaseCreate)
router.post('/purchase/created', purchaseController.purchaseCreated)

router.get('/purchase/:id', purchaseController.purchaseInfo)
router.put('/purchase/updated/:id', purchaseController.purchaseUpdate)

module.exports = router