const express = require('express')
const router = express.Router()
const allChatsController = require('../../app/controllers/admin/allChatsController')

router.get('/', allChatsController.allChats)

module.exports = router