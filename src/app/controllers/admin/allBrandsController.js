const brand = require('../../models/brandModel')

class allBrandsController {
  async allBrands(req, res, next) {
    const brands = await brand.find({}).lean()
    const index  = 'brands'
    const totalBrand = brands.length

    res.render('admin/allBrands', { title: 'Danh sách cửa hàng', layout: 'admin', brands, totalBrand, index })
  }

  async brandInfo(req, res, next) {
    const index = 'brands'
    const brandInfo = brand.findOne({ _id: req.params.id }).lean()

    res.render('admin/brand', { title: '', layout: 'admin', brandInfo, index })
  }
}
module.exports = new allBrandsController