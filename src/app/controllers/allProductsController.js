const product = require('../models/productModel')

class allProductsController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { res.render('users/allProducts', { product }) })
      .catch(next)
  }
}

module.exports = new allProductsController