const express = require('express')
const router = express.Router()
const allChatsController = require('../../app/controllers/admin/allChatsController')

router.get('/', allChatsController.allChats)
router.get('/chat/:id', allChatsController.chatInfo)

module.exports = router