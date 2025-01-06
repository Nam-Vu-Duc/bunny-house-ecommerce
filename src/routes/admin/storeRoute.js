const express = require('express')
const router = express.Router()
const storeController = require('../../app/controllers/admin/storeController')

router.get('/', storeController.allStores)

router.get('/store/create', storeController.storeCreate)
router.post('/store/created', storeController.storeCreated)

router.get('/store/:id', storeController.storeInfo)
router.put('/store/updated/:id', storeController.storeUpdate)

module.exports = router