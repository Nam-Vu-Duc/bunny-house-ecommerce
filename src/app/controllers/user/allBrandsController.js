const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async showAllBrands(req, res, next) {
    const isUser = req.isUser === true ? true : false

    const brands = await brand.find().lean()

    res.render('users/allBrands', { title: 'Toàn bộ thương hiệu', brands, isUser }) 
  }

  async brandInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    
    const brandInfo =  await brand.findOne({ _id: req.params.id }).lean()
    if (!brandInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const products = await product.find({ brand: brandInfo.name }).lean()
    res.render('users/detailBrand', { title: brandInfo.name, brandInfo, products, isUser })
  }
}
module.exports = new allBrandsController