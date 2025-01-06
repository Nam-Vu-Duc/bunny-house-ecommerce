const express = require('express')
const router = express.Router()
const chatController = require('../../app/controllers/admin/chatController')

router.get('/', chatController.allChats)

module.exports = router