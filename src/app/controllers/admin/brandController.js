const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async allBrands(req, res, next) {
    const index  = 'brands'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage

    const [brands, totalBrand] = await Promise.all([
      brand.find({}).sort({ createdAt: -1 }).skip(skip).limit(itemsPerPage).lean(),
      brand.find({}).countDocuments()
    ])

    res.render('admin/all/brand', { title: 'Danh sách cửa hàng', layout: 'admin', index, successful, brands, totalBrand, currentPage })
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