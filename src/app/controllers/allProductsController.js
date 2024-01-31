const product = require('../models/productModel')

class allProductsController {
  show(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: 'Tất cả sản phẩm', product }) })
      .catch(next)
  }

  showFlashSale(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const flashDealProduct = product.filter(product => product.hotsale === 'flash-sale')
        res.render('users/allProducts', { title: 'Sản phẩm Flash Saleeeee', flashDealProduct }) })
      .catch(next)
  }

  showHot(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const hotProduct = product.filter(product => product.hotsale === 'hot')
        res.render('users/allProducts', { title: 'Sản phẩm Hottttt', hotProduct }) })
      .catch(next)
  }
}

module.exports = new allProductsController