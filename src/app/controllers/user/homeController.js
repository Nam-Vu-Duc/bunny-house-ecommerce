const product = require('../../models/productModel')
const brand = require('../../models/brandModel')
const chat = require('../../models/chatModel')

class homeController {
  async show(req, res, next) {
    const sync_chat = req.flash('sync-chat')
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.user_id ? req.cookies.user_id : null
    const chatId = req.cookies.chat_id ? req.cookies.chat_id : null
    // const chatData = chatId ? await chat.findOne({ _id: chatId }).lean() : null

    const [products, brands] = await Promise.all([
      product.find({ deletedAt: null }).lean(),
      brand.find({}).lean(),
    ])

    const categorizedProducts = products.reduce(
      (acc, item) => {
        if (acc.flashDealProduct.length < 5 && item.status === 'flash-sale') acc.flashDealProduct.push(item)
        if (acc.hotProduct.length < 5 && item.status === 'hot') acc.hotProduct.push(item)
        if (acc.allProduct.length < 5) acc.allProduct.push(item)
        return acc
      },
      { flashDealProduct: [], hotProduct: [], allProduct: [] }
    );

    res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng', ...categorizedProducts, brands, userId, chatId, isUser, sync_chat });
  }
}
module.exports = new homeController