const express = require('express')
const router = express.Router()
const allStoresController = require('../../app/controllers/admin/allStoresController')

router.get('/', allStoresController.allStores)
router.get('/store/:id', allStoresController.storeInfo)

module.exports = router