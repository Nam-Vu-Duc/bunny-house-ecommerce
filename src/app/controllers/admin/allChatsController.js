const chat = require('../../models/chatModel')

class allChatsController {
  async allChats(req, res, next) {
    const index  = 'chats'
    const chats = await chat.aggregate([
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
      }
    ])
    const totalChat = chats.length

    res.render('admin/allChats', { title: 'Danh sách chat', layout: 'admin', chats, totalChat, index })
  }
}
module.exports = new allChatsController