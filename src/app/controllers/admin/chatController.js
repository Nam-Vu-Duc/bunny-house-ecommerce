const chat = require('../../models/chatModel')
const user = require('../../models/userModel')
const emp  = require('../../models/employeeModel')
const message = require('../../models/messageModel')

class allChatsController {
  async getChats(req, res, next) {
    
  }

  async getUser(req, res, next) {
    try {
      const empInfo = await emp.findOne({ _id: req.cookies.uid }).lean()
      if (!empInfo) return res.json({isValid: false, message: 'not found'})
  
      return res.json({isValid: true, message: empInfo._id})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async allChats(req, res, next) {
    try {
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
  
      return res.render('admin/all/chat', { title: 'Danh sách chat', layout: 'admin', uid, chats, totalChat })
      
    } catch (error) {
      return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    }
  }

  async chatInfo(req, res) {
    try {
      const userId = req.params.id
      const userStatus = await user.findOne({ _id: userId }).lean()
      const chatRoom = await chat.findOne({ userId: userId }).lean()
      const chatMessages = await message.find({ chatId: chatRoom._id }).sort({createdAt: 1}).lean()
      return res.json({data: chatMessages, chatId: chatRoom._id, userStatus: userStatus.isActive})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async chatCreated(req, res) {
    try {
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
      return res.json({message: 'save successfully'})

    } catch (error) {
      return res.json({error: error})
    }
  }

  async chatLastMessage(req, res) {
    try {
      const chatInfo = await chat.findOne({ userId: req.body.userId}).lean()
      if (!chatInfo) return res.json({lastMessage: ''})
      return res.json({lastMessage: chatInfo.lastMessage})
      
    } catch (error) {
      return res.json({error: error})
    }
  }
}
module.exports = new allChatsController