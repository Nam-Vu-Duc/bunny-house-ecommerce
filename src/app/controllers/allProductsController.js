const product = require('../models/productModel')

class allProductsController {
  showAll(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: 'Tất cả sản phẩm', product }) })
      .catch(next)
  }

  showFlashSale(req, res, next) {
    product.find({ deletedAt: null, hotsale: 'flash-sale' }).lean().sortable(req)
      .then(product => { res.render('users/allProductsFlashSale', { title: 'Sản phẩm Flash Saleeeee', product }) })
      .catch(next)
  }

  showHot(req, res, next) {
    product.find({ deletedAt: null, hotsale: 'hot' }).lean().sortable(req)
      .then(product => { res.render('users/allProductsHot', { title: 'Sản phẩm Hottttt', product }) })
      .catch(next)
  }

  showCategory(req, res, next) {
    product.find({ deletedAt: null, $or: [{skincare: req.params.slug}, {makeup: req.params.slug}] }).lean().sortable(req)
      .then(product => { res.render('users/allProductsHot', { title: req.params.slug, product }) })
      .catch(next)
  }
}

module.exports = new allProductsController