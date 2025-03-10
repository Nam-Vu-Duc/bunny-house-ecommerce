const brand = require('../../models/brandModel')
const product = require('../../models/productModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class allBrandsController {
  // all
  async getBrands(req, res, next) {
    try {
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

    } catch (error) {
      return res.json({error: error})
    }
  }

  async getFilter(req, res, next) {
  
  }
  
  async allBrands(req, res, next) {
    return res.render('admin/all/brand', { title: 'Danh sách cửa hàng', layout: 'admin' })
  }

  // update
  async getBrand(req, res, next) {
    try {
      const brandInfo = await brand.findOne({ _id: req.body.id }).lean()
      if (!brandInfo) return res.json({brandInfo: null})
  
      const productsInfo = await product.find({ brand: brandInfo.name }).lean()
  
      res.json({brandInfo: brandInfo, productsInfo: productsInfo})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async brandInfo(req, res, next) {
    try {
      if (!checkForHexRegExp(req.params.id)) throw new Error('error')
      if (!(await brand.findOne({ _id: req.params.id }).lean())) throw new Error('error')

      return res.render('admin/detail/brand', { layout: 'admin' })

    } catch (error) {
      return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' }) 
    }
  }

  async brandUpdate(req, res, next) {

  }

  // create
  async brandCreate(req, res, next) {    
    return res.render('admin/create/brand', { title: 'Thêm thương hiệu mới', layout: 'admin' })
  }

  async brandCreated(req, res, next) {

  }
}
module.exports = new allBrandsController