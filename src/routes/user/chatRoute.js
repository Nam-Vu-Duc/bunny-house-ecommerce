const express = require('express')
const router = express.Router()
const chat = require('../../app/models/chatModel')
const message = require('../../app/models/messageModel')

router.get('/:id', async function(req, res) {
  // const userId = req.params.id
  const userId = '6768d9cb3359a06e2b55637f'
  const chatData = await chat.findOne({ userId: userId }).lean()
  const chatMessages = await message.find({ chatId: chatData._id }).sort({'timestamp': -1}).lean()
  res.json({data: chatMessages})
})

module.exports = router