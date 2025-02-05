const express = require('express')
const router = express.Router()
const chat = require('../../app/models/chatModel')
const message = require('../../app/models/messageModel')

router.use(express.json())
router.get('/:id', async function(req, res) {
  const userId = req.params.id
  const chatRoom = await chat.findOne({ userId: userId }).lean()
  const chatMessages = await message.find({ chatId: chatRoom._id }).sort({'timestamp': -1}).lean()
  res.json({data: chatMessages})
})
router.post('/create', async function(req, res) {
  console.log(req.body)
  const newMessage = new message({
    chatId: req.cookies.cid,
    senderId: req.cookies.uid,
    content: req.body.value
  })
  await newMessage.save()
  res.json({message: 'save successfully'})
})

module.exports = router