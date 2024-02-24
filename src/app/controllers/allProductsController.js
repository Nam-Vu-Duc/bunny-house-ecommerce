const product = require('../models/productModel')

class allProductsController {
  showAll(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        const type = req.params.slug
        if (type === 'flash-sale') {
          product = product.filter(product => product.hotsale === 'flash-sale' )
        }
        if (type === 'hot') {
          product = product.filter(product => product.hotsale === 'hot' )
        }
        res.render('users/allProducts', { title: 'Toàn Bộ Sản Phẩm', product, type }) })
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