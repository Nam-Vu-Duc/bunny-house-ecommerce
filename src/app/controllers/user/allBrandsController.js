const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async showAllBrands(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const holderBrands = Array(8).fill({})

    res.render('users/allBrands', { title: 'Toàn bộ thương hiệu', isUser, userId, holderBrands }) 
  }

  async brandInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const brandInfo =  await brand.findOne({ _id: req.params.id }).lean()
    if (!brandInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const products = await product.find({ brand: brandInfo.name }).lean()
    res.render('users/detailBrand', { title: brandInfo.name, brandInfo, products, isUser, userId })
  }

  async getBrands(req, res, next) {
    const brands = await brand.find().lean()

    res.json({data: brands})
  }

  async getBrand(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const brandInfo =  await brand.findOne({ _id: req.params.id }).lean()
    if (!brandInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    const products = await product.find({ brand: brandInfo.name }).lean()
    res.render('users/detailBrand', { title: brandInfo.name, brandInfo, products, isUser, userId })
  }
}
module.exports = new allBrandsController