const express = require('express')
const router = express.Router()
const chatController = require('../../app/controllers/admin/chatController')

router.get('/'                  , chatController.allChats)
router.get('/:id'               , chatController.chatInfo)
router.post('/create'           , chatController.chatCreated)
router.post('/get-last-message' , chatController.chatLastMessage)

router.post('/data/chats'       , chatController.getChats)

module.exports = router