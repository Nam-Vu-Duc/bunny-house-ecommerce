const brand = require('../../models/brandModel')
const product = require('../../models/productModel')

class allBrandsController {
  async getBrands(req, res, next) {
    const brands = await brand.find().lean()
    if (!brands) return res.json({message: 'brands not found'})

    res.json({data: brands})
  }

  async getBrand(req, res, next) {
    const brandInfo =  await brand.findOne({ _id: req.body.id }).lean()
    if (!brandInfo) return res.json({message: 'brand not found'})

    return res.json({data: brandInfo})
  }
  
  async getRelatedProducts(req, res, next) {
    const relatedProducts = await product.find({ brand: req.body.name })
    if (!relatedProducts) return res.json({message: 'products not found'})

    return res.json({data: relatedProducts})
  }

  async showAllBrands(req, res, next) {
    const holderBrands = Array(8).fill({})

    res.render('users/allBrands', { title: 'Toàn bộ thương hiệu', holderBrands }) 
  }

  async brandInfo(req, res, next) {
    const holderRelatedProducts = Array(5).fill({})

    res.render('users/detailBrand', { holderRelatedProducts })
  }
}
module.exports = new allBrandsController