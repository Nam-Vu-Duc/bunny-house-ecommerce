const brand = require('../../models/brandModel')

class allChatsController {
  async allChats(req, res, next) {
    const brands = await brand.find({}).lean()
    const index  = 'chats'
    const totalBrand = brands.length

    res.render('admin/allBrands', { title: 'Danh sách cửa hàng', layout: 'admin', brands, totalBrand, index })
  }

  async chatInfo(req, res, next) {
    const index = 'chats'
    const brandInfo = brand.findOne({ _id: req.params.id }).lean()

    res.render('admin/brand', { title: '', layout: 'admin', brandInfo, index })
  }
}
module.exports = new allChatsController