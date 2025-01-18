const product = require('../../models/productModel')
const brand = require('../../models/brandModel')

class homeController {
  async show(req, res, next) {
    const sync_chat = req.flash('sync-chat')
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id ? req.cookies.user_id : null
    const chatId = req.cookies.chat_id ? req.cookies.chat_id : null
    
    const [products, brands] = await Promise.all([
      product.find({ deletedAt: null }).lean(),
      brand.find({}).lean(),
    ])
    res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng', products, brands, userId, chatId, isUser, sync_chat });
  }
}
module.exports = new homeController