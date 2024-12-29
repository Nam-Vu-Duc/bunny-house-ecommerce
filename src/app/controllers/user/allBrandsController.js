const brand = require('../../models/brandModel')

class allBrandsController {
  async showAllBrands(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const brands =  await brand.find().lean()
    res.render('users/allBrands', { title: 'Toàn bộ thương hiệu', brands, isUser }) 
  }

  async brandInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const brandInfo =  await brand.findOne({ _id: req.params.id }).lean()
    res.render('users/detailBrand', { title: brandInfo.name, brandInfo, isUser })
  }
}
module.exports = new allBrandsController