const express = require('express')
const router = express.Router()

const introduceController = require('../app/controllers/introduceController')

// productController.index
router.get('/', introduceController.show)

module.exports = router