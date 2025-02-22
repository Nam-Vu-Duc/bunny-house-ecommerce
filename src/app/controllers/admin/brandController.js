const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async getBrands(req, res, next) {
    
  }

  async getBrand(req, res, next) {
    
  }

  async getFilter(req, res, next) {
  
  }
  
  async allBrands(req, res, next) {
    const holderData = Array(10).fill({})

    res.render('admin/all/brand', { title: 'Danh sách cửa hàng', layout: 'admin', holderData })
  }

  async brandInfo(req, res, next) {
    const index = 'brands'
    const brandInfo = await brand.findOne({ _id: req.params.id }).lean()
    const productsInfo = await product.find({ brand: brandInfo.name }).lean()

    res.render('admin/detail/brand', { title: brandInfo.name, layout: 'admin', index, brandInfo, productsInfo })
  }

  async brandUpdate(req, res, next) {

  }

  async brandCreate(req, res, next) {
    const index = 'brands'
    
    res.render('admin/create/brand', { title: 'Thêm thương hiệu mới', layout: 'admin', index })
  }

  async brandCreated(req, res, next) {

  }
}
module.exports = new allBrandsController