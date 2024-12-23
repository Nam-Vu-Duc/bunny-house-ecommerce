const brand = require('../../models/brandModel')

class allChatsController {
  async allChats(req, res, next) {
    const chats = await brand.find({}).lean()
    const index  = 'chats'
    const totalChat = chats.length

    res.render('admin/allChats', { title: 'Danh sách cửa hàng', layout: 'admin', chats, totalChat, index })
  }

  async chatInfo(req, res, next) {
    const index = 'chats'
    const brandInfo = brand.findOne({ _id: req.params.id }).lean()

    res.render('admin/chat', { title: '', layout: 'admin', brandInfo, index })
  }
}
module.exports = new allChatsController