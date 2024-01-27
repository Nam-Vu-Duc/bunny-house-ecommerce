const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/homeController')

// homeController.index
router.get('/', homeController.show)

module.exports = router