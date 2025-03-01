const product = require('../../models/productModel')
const brand = require('../../models/brandModel')
const user = require('../../models/userModel')

class homeController {
  async getProducts(req, res, next) {
    const filter = req.body
    const data = await product.find(filter).sort({ saleNumber: -1 }).limit(5).lean()
    
    return res.json({data: data})
  }
  
  async getOutOfOrderProducts(req, res, next) {
    const data = await product.find({ status: 'out-of-order' }).lean()
    
    return res.json({data: data})
  }

  async getOrderProducts(req, res, next) {
    const productIds = req.body.productIds
    const data = await product.find({ _id: { $in: productIds } }).lean()
    
    return res.json({data: data})
  }


  async getUsers(req, res, next) {
    const userId = req.cookies.uid || ''
    if (!userId) return res.json({message: false})
    
    const userInfo = await user.findOne({ _id: userId }).lean()
    if (!userInfo) return res.json({message: false})
    
    return res.json({message: true, uid: userId, data: userInfo})
  }

  async getBrands(req, res, next) {
    const data = await brand.find().lean()
    return res.json({data: data})
  }

  async show(req, res, next) {
    res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng' })
  }

  async searchInfo(req, res, next) {
    const query = req.body.query
    const data = await product.find({
      $or: [
        { name: { $regex: query, $options: 'i'} },
        { brand: { $regex: query, $options: 'i'}}
      ]
    }).lean()
    return res.json({data: data})
  }
}
module.exports = new homeController