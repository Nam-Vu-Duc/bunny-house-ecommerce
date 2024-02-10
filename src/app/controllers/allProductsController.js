const product = require('../models/productModel')

class allProductsController {
  showAll(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { res.render('users/allProducts', { title: 'Tất cả sản phẩm', product }) })
      .catch(next)
  }

  showFlashSale(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const flashDealProduct = product.filter(product => product.hotsale === 'flash-sale')
        res.render('users/allProductsFlashSale', { title: 'Sản phẩm Flash Saleeeee', flashDealProduct }) })
      .catch(next)
  }

  showHot(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const hotProduct = product.filter(product => product.hotsale === 'hot')
        res.render('users/allProductsHot', { title: 'Sản phẩm Hottttt', hotProduct }) })
      .catch(next)
  }

  showCategory(req, res, next) {
    product.find({ deletedAt: null, skincare: req.params.slug }).lean().sortable(req)
      .then(product => { 
        // const categoryProduct = product.filter(product => product.skincare || product.skincare === 'hot')
        res.render('users/allProductsHot', { title: 'Sản phẩm Hottttt', product }) })
      .catch(next)
  }
}

module.exports = new allProductsController