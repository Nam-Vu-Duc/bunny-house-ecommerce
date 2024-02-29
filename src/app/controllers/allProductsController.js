const product = require('../models/productModel')

class allProductsController {
  showAll(req, res, next) {
    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const type = req.params.slug
        let title = 'Toàn Bộ Sản Phẩm'
        if (type === 'flash-sale') {
          product = product.filter(product => product.hotsale === 'flash-sale' )
          title = 'Sản Phẩm Đang Flash-sale'
        }
        if (type === 'hot') {
          product = product.filter(product => product.hotsale === 'hot' )
          title = 'Sản Phẩm Đang Hot'
        }
        if (type === 'new-arrival') {
          product = product.filter(product => product.newArrival === 'yes' )
          title = 'Sản Phẩm Mới Về'
        }
        if (type === 'skincare') {
          product = product.filter(product => product.skincare !== '' )
          title = 'Sản Phẩm Skincare'
        }
        if (type === 'makeup') {
          product = product.filter(product => product.makeup !== '' )
          title = 'Sản Phẩm Makeup'
        }
        res.render('users/allProducts', { title: title, product, type }) })
      .catch(next)
  }

  showSkincare(req, res, next) {
    product.find({ deletedAt: null, skincare: req.params.slug }).lean().sortable(req)
      .then(product => { 
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const type = req.params.slug
        let title = type.charAt(0).toUpperCase() + type.slice(1).replaceAll('-', ' ')
        res.render('users/allProducts', { title: title, product, type }) })
      .catch(next)
  }

  showMakeUp(req, res, next) {
    product.find({ deletedAt: null, makeup: req.params.slug }).lean().sortable(req)
      .then(product => { 
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const type = req.params.slug
        let title = type.charAt(0).toUpperCase() + type.slice(1).replaceAll('-', ' ')
        res.render('users/allProducts', { title: title, product, type }) })
      .catch(next)
  }
}

module.exports = new allProductsController