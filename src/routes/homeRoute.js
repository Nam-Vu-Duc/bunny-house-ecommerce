const express = require('express')
const router = express.Router()

const homeController = require('../app/controllers/homeController')

router.get('/:id', homeController.showUser )

router.get('/', homeController.show )

module.exports = router