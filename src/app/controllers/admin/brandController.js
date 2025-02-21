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
    const index        = 'brands'
    const successful   = req.flash('successful')

    const currentPage  = req.query.page || 1
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= {}

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = queryList[key]
      }
    }

    const [brands, totalBrand] = await Promise.all([
      brand
      .find(filterOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .lean(),
      brand.find(filterOptions).countDocuments()
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