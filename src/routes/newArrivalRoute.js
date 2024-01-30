const express = require('express')
const router = express.Router()

const newArrivalController = require('../app/controllers/newArrivalController')

// productController.index
router.get('/', newArrivalController.show)

module.exports = router