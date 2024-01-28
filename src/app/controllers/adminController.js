const product = require('../models/productModel')

class adminController {
  create(req, res, next) {
    res.render('admin/create')
  }

  created(req, res, next) {
    const newProduct = new product(req.body)
    newProduct.save()
      .then(() => res.redirect('/home'))
      .catch(next)
  }

  update(req, res, next) {
    product.find({}).lean()
      .then(product => { res.render('admin/update', { product }) })
      .catch(next)
  }

  updating(req, res, next) {
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updating', { product }) })
      .catch(next)
  }

  updated(req, res, next) {
    product.updateOne({ _id: req.params.id}, req.body)
      .then(() => res.redirect('/admin/update'))
      .catch(next)
  }
}

module.exports = new adminController