const chat = require('../../models/chatModel')
const user = require('../../models/userModel')
const message = require('../../models/messageModel')

class allChatsController {
  async allChats(req, res, next) {
    const index = 'chats'
    const uid = req.cookies.uid
    const [chats, totalChat] = await Promise.all([
      chat.aggregate([
        {
          $lookup: {
            from: "users",  // The collection to join (table2)
            let: { userIdStr: "$userId" },  // Define a variable for userId
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", { $toObjectId: "$$userIdStr" }]  // Match _id with converted userId
                  }
                }
              }
            ],
            as: "userInfo"  // Name of the joined data field
          }
        },
        {
          $unwind: "$userInfo"  // Flatten the array (optional)
        },
        {
          $sort: { updatedAt: -1 }
        }
      ]),
      chat.find().countDocuments(),
    ])

    res.render('admin/all/chat', { title: 'Danh sách chat', layout: 'admin', uid, index, chats, totalChat })
  }

  async chatInfo(req, res) {
    const userId = req.params.id
    const userStatus = await user.findOne({ _id: userId }).lean()
    const chatRoom = await chat.findOne({ userId: userId }).lean()
    const chatMessages = await message.find({ chatId: chatRoom._id }).sort({createdAt: 1}).lean()
    res.json({data: chatMessages, chatId: chatRoom._id, userStatus: userStatus.isActive})
  }

  async chatCreated(req, res) {
    const newMessage = new message({
      chatId: req.body.chatId,
      senderId: req.cookies.uid,
      content: req.body.value
    })
    await chat.updateOne({_id: req.body.chatId}, {
      updatedAt: new Date(),
      lastMessage: req.body.value
    })
    await newMessage.save()
    res.json({message: 'save successfully'})
  }

  async chatLastMessage(req, res) {
    const chatInfo = await chat.findOne({ userId: req.body.userId}).lean()
    if (!chatInfo) return res.json({lastMessage: ''})
    res.json({lastMessage: chatInfo.lastMessage})
  }
}
module.exports = new allChatsController