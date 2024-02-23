const product = require('../models/productModel')

class allProductsController {
  showAll(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: 'Toàn Bộ Sản Phẩm', product }) })
      .catch(next)
  }

  showFlashSale(req, res, next) {
    product.find({ deletedAt: null, hotsale: 'flash-sale' }).lean().sortable(req)
      .then(product => { res.render('users/allProductsFlashSale', { title: 'Sản Phẩm Flash Sale', product }) })
      .catch(next)
  }

  showHot(req, res, next) {
    product.find({ deletedAt: null, hotsale: 'hot' }).lean().sortable(req)
      .then(product => { res.render('users/allProductsHot', { title: 'Sản Phẩm Hot', product }) })
      .catch(next)
  }

  showSkincare(req, res, next) {
    product.find({ deletedAt: null, skincare: req.params.slug }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: req.params.slug, product }) })
      .catch(next)
  }

  showMakeUp(req, res, next) {
    product.find({ deletedAt: null, makeup: req.params.slug }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: req.params.slug, product }) })
      .catch(next)
  }
}

module.exports = new allProductsController