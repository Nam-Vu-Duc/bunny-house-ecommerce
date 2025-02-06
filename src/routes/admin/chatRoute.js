const express = require('express')
const router = express.Router()
const chatController = require('../../app/controllers/admin/chatController')

router.get('/', chatController.allChats)
router.get('/:id', chatController.chatInfo)
router.post('/create', chatController.chatCreated)

module.exports = router