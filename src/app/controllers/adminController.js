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
    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const total = product.length
        res.render('admin/update', { product, total })})
      .catch(next)
  }

  updating(req, res, next) {
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updating', { product }) })
      .catch(next)
  }

  updated(req, res, next) {
    product.updateOne({ _id: req.params.id}, req.body)
      .then(() => { 
        res.redirect('/admin/update')})
      .catch(next)
  }

  delete(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  trash(req, res, next) {
    product.find({ deletedAt: { $ne: null } }).lean()
      .then(product => { 
        const total = product.length
        res.render('admin/trash', { product, total })})
      .catch(next)
  }

  formActions(req, res, next) {
    switch(req.body.action) {
      case 'delete' : 
        product.updateMany({ _id: { $in: req.body.courseIds }}, { deletedAt: Date.now() })
          .then(() => res.redirect('back'))
          .catch(next)
        break;
      default: 
        res.json({ message: 'action is invalid' })
    }
  }
}

module.exports = new adminController