const product = require('../models/productModel')

class homeController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean()
      .then(product => { res.render('users/home', { product }) })
      .catch(next)
  }
}

module.exports = new homeController