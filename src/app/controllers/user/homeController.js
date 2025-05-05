const product = require('../../models/productModel')
const voucher = require('../../models/voucherModel')
const brand = require('../../models/brandModel')
const user = require('../../models/userModel')

class homeController {
  async getVouchers(req, res, next) {
    try {
      const data = await voucher.find({ status: 'active' }).lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }
  
  async getProducts(req, res, next) {
    try {
      const filter = req.body
      const data = await product.find(filter).sort({ saleNumber: -1 }).limit(5).lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }
  
  async getOutOfOrderProducts(req, res, next) {
    try {
      const data = await product.find({ status: 'out-of-order' }).lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }

  async getOrderProducts(req, res, next) {
    try {
      const productIds = req.body.productIds
      const data = await product.find({ _id: { $in: productIds } }).lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }

  async getUsers(req, res, next) {
    try {
      const userId = req.cookies.uid || ''
      if (!userId) return res.json({message: false})
      
      const userInfo = await user.findOne({ _id: userId }).lean()
      if (!userInfo) return res.json({message: false})
      
      return res.json({message: true, uid: userId})
    } catch (error) {
      return res.json({error: error.message})
    }
  }

  async getBrands(req, res, next) {
    try {
      const data = await brand.find().lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }

  async show(req, res, next) {
    return res.render('users/home', { title: 'Bunny House - Cửa hàng mỹ phẩm chính hãng' })
  }

  async searchInfo(req, res, next) {
    try {
      const query = req.body.query
      const data = await product.find({
        $or: [
          { name: { $regex: query, $options: 'i'} },
          { brand: { $regex: query, $options: 'i'}}
        ]
      }).lean()
      return res.json({data: data})
    } catch (error) {
      return res.json({error: error.message})
    }
  }
}
module.exports = new homeController