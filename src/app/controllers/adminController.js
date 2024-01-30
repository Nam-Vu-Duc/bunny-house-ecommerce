const product = require('../models/productModel')

class adminController {
  show(req, res, next) {
    res.render('admin/home', { layout: 'admin' })
  }

  create(req, res, next) {
    res.render('admin/create', { layout: 'admin' })
  }

  created(req, res, next) {
    const newProduct = new product(req.body)
    newProduct.save()
      .then(() => res.redirect('/home'))
      .catch(next)
  }

  update(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const total = product.length
        res.render('admin/update', { layout: 'admin', total, product })})
      .catch(next)
  }

  updating(req, res, next) {
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updating', { layout: 'admin', product } )})
      .catch(next)
  }

  updated(req, res, next) {
    product.updateOne({ _id: req.params.id}, req.body)
      .then(() => { 
        res.redirect('/admin/update')})
      .catch(next)
  }

  softDelete(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
      .then(() => res.redirect('/admin/trash'))
      .catch(next)
  }

  delete(req, res, next) {
    product.deleteOne({ _id: req.params.id})
      .then(() => res.redirect('back'))
      .catch(next)
  }

  restore(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: null })
      .then(() => res.redirect('/admin/update'))
      .catch(next)
  }

  trash(req, res, next) {
    product.find({ deletedAt: { $ne: null } }).lean()
      .then(product => { 
        const total = product.length
        res.render('admin/trash', { layout: 'admin', total, product } )})
      .catch(next)
  }
}

module.exports = new adminController