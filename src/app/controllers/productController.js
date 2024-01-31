const product = require('../models/productModel')

class productController {
  show(req, res, next) {
    product.findOne({ slug: req.params.slug }).lean()
      .then(product => { 
        res.render('users/product', { title: product.name , product }) })
      .catch(next)
  }
}

module.exports = new productController