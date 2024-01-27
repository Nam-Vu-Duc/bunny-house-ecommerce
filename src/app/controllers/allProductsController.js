const product = require('../models/productModel')

class allProductsController {
  show(req, res, next) {
    product.find({}).lean()
      .then(product => { res.render('users/allProducts', { product }) })
      .catch(next)
  }
}

module.exports = new allProductsController