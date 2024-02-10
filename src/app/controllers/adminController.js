const product = require('../models/productModel')
const user = require('../models/userModel')

class adminController {
  show(req, res, next) {
    res.render('admin/home', { title: 'Trang chủ admin', layout: 'admin' })
  }

  create(req, res, next) {
    res.render('admin/create', { title: 'Thêm sản phẩm mới', layout: 'admin' })
  }

  created(req, res, next) {
    let newProduct = new product(req.body)
    if (req.file) {
      newProduct.avatar = req.file.filename
    }
    newProduct.save()
      .then(() => res.redirect('/admin/update'))
      .catch(next)
  }

  update(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const total = product.length
        res.render('admin/update', { title: 'Toàn bộ sản phẩm', layout: 'admin', total, product })})
      .catch(next)
  }

  updating(req, res, next) {
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updating', { title: 'Sửa sản phẩm', layout: 'admin', product } )})
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
      .then(() => res.redirect('back'))
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
        res.render('admin/trash', { title: 'Thùng rác', layout: 'admin', total, product } )})
      .catch(next)
  }

  updateProfile(req, res, next) {
    user.findById(req.params.id).lean()
      .then(user => { res.render('admin/profileUpdate', { title: 'Cập nhật thông tin cá nhân', layout: 'admin', user } )})
      .catch(next)
  }
}

module.exports = new adminController