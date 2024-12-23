const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async allBrands(req, res, next) {
    const brands = await brand.find({}).lean()
    const index  = 'brands'
    const totalBrand = brands.length

    res.render('admin/allBrands', { title: 'Danh sách cửa hàng', layout: 'admin', brands, totalBrand, index })
  }

  async brandInfo(req, res, next) {
    const index = 'brands'
    const brandInfo = await brand.findOne({ _id: req.params.id }).lean()
    const productsInfo = await product.find({ brand: brandInfo.name }).lean()

    res.render('admin/brand', { title: brandInfo.name, layout: 'admin', brandInfo, productsInfo, index })
  }
}
module.exports = new allBrandsController