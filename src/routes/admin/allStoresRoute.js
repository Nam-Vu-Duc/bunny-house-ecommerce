const express = require('express')
const router = express.Router()
const allStoresController = require('../../app/controllers/admin/allStoresController')

router.get('/', allStoresController.allStores)

router.get('/store/create', allStoresController.storeCreate)
router.post('/store/created', allStoresController.storeCreated)

router.get('/store/:id', allStoresController.storeInfo)
router.put('/store/updated/:id', allStoresController.storeUpdate)

module.exports = router