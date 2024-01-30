const product = require('../models/productModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const flashDealProduct = product.filter(product => product.price === 100000)
        const hotProduct = product.filter(product => product.price === 200000)
        const allProduct = product
        res.render('users/home', { flashDealProduct, hotProduct, allProduct }) })
      .catch(next)
  }
}

module.exports = new homeController