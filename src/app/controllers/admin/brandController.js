const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  // all
  async getBrands(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      brand
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      brand.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getFilter(req, res, next) {
  
  }
  
  async allBrands(req, res, next) {
    res.render('admin/all/brand', { title: 'Danh sách cửa hàng', layout: 'admin' })
  }

  // update
  async getBrand(req, res, next) {
    const brandInfo = await brand.findOne({ _id: req.body.id }).lean()
    if (!brandInfo) return res.json({brandInfo: null})

    const productsInfo = await product.find({ brand: brandInfo.name }).lean()

    res.json({brandInfo: brandInfo, productsInfo: productsInfo})
  }

  async brandInfo(req, res, next) {
    res.render('admin/detail/brand', { layout: 'admin' })
  }

  async brandUpdate(req, res, next) {

  }

  // create
  async brandCreate(req, res, next) {    
    res.render('admin/create/brand', { title: 'Thêm thương hiệu mới', layout: 'admin' })
  }

  async brandCreated(req, res, next) {

  }
}
module.exports = new allBrandsController