const product = require('../../models/productModel')
const brand = require('../../models/brandModel')

class homeController {
  async show(req, res, next) {
    const sync_chat = req.flash('sync-chat')
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const chatId = req.cookies.chat_id || null
    
    const [flashSaleProducts, hotProducts, hotSaleProducts, allProducts, brands] = await Promise.all([
      product.find({ deletedAt: null, status: 'flash-sale' }).limit(5).lean(),
      product.find({ deletedAt: null, status: 'hot' }).limit(5).lean(),
      product.find({ deletedAt: null }).sort({ saleNumber: -1 }) .limit(5).lean(),
      product.find({ deletedAt: null }).limit(5).lean(),
      brand.find({}).lean(),
    ])
    res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng', isUser, flashSaleProducts, hotProducts, hotSaleProducts, allProducts, brands, userId, chatId, sync_chat })
  }

  async searchInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const chatId = req.cookies.chat_id || null
  
    const query = req.query.q

    const products = await product.find({
      $or: [
        { name: { $regex: query, $options: 'i'} },
        { brand: { $regex: query, $options: 'i'}}
      ]
    }).lean()
    res.render('users/searchInfo', { title: 'Kết quả tìm kiếm', isUser, products, userId, chatId, query });
  }
}
module.exports = new homeController