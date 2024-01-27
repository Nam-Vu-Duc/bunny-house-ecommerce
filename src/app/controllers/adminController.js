const product = require('../models/productModel')

class adminController {
  create(req, res, next) {
    res.render('admin/admin')
  }

  created(req, res, next) {
    const newProduct = new product(req.body)
    newProduct.save()
      .then(() => res.redirect('/home'))
      .catch(next)
  }
}

module.exports = new adminController