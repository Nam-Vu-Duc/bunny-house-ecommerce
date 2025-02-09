const express = require('express')
const router = express.Router()
const chat = require('../../app/models/chatModel')
const message = require('../../app/models/messageModel')

router.use(express.json())
router.get('/:id', async function(req, res) {
  const userId = req.params.id
  const chatRoom = await chat.findOne({ userId: userId }).lean()
  const chatMessages = await message.find({ chatId: chatRoom._id }).sort({createdAt: 1}).lean()
  res.json({data: chatMessages})
})
router.post('/create', async function(req, res) {
  const userId = req.cookies.uid
  const chatRoom = await chat.findOne({ userId: userId }).lean()
  const newMessage = new message({
    chatId: chatRoom._id,
    senderId: userId,
    content: req.body.value
  })
  await chat.updateOne({_id: chatRoom._id}, {
    updatedAt: new Date(),
    lastMessage: req.body.value
  })
  await newMessage.save()
  res.json({message: 'save successfully'})
})

module.exports = router