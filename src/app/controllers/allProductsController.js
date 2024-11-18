const product = require('../models/productModel')
const brand = require('../models/brandModel')

class allProductsController {
  showAllProducts(req, res, next) {
    const currentPage  = req.query.page   || 1
    const sortedColumn = req.query.column || ''
    const sort         = req.query.sort   || ''
    const type         = req.params.slug
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    product.find({ deletedAt: null }).lean()
      .then(product => { 
        let title = 'Toàn Bộ Sản Phẩm'
        const filters = {
          'flash-sale' : { filter: product => product.status     === 'flash-sale', title: 'Sản Phẩm Đang Flash Sale' },
          'hot'        : { filter: product => product.status     === 'hot'       , title: 'Sản Phẩm Đang Hot'        },
          'new-arrival': { filter: product => product.newArrival === 'yes'       , title: 'Sản Phẩm Mới Về'          },
          'skincare'   : { filter: product => product.skincare   !== ''          , title: 'Sản Phẩm Skincare'        },
          'makeup'     : { filter: product => product.makeup     !== ''          , title: 'Sản Phẩm Makeup'          }
        };
        if (type in filters) {
          product = product.filter(filters[type].filter);
          title = filters[type].title;
        }

        if (sortedColumn === 'price' && sort === 'asc') {
          product = product.sort((a, b) => a.price - b.price)
        } else if (sortedColumn === 'price' && sort === 'desc') {
          product = product.sort((a, b) => b.price - a.price)
        }

        const productLength = product.length
        product = product.slice(skip, skip + itemsPerPage)
        
        res.render('users/allProducts', { title: title, product, type, productLength, currentPage, sortedColumn, sort }) })
      .catch(next)
  }

  showSkincare(req, res, next) {
    product.find({ deletedAt: null, skincare: req.params.slug }).lean()
      .then(product => {    
        const type = req.params.slug

        res.render('users/allProducts', { title: 'Dòng Skincare', product, type }) })
      .catch(next)
  }

  showMakeUp(req, res, next) {
    product.find({ deletedAt: null, makeup: req.params.slug }).lean()
      .then(product => {     
        const type       = req.params.slug
        
        res.render('users/allProducts', { title: 'Dòng Makeup', product, type }) })
      .catch(next)
  }

  showAllBrands(req, res, next) {
    brand.find().lean()
      .then(brand => { 
        res.render('users/allBrands', { title: 'Toàn bộ thương hiệu', brand }) })
      .catch(next)
  }

  showBrand(req, res, next) {
    product.find({ deletedAt: null, brand: req.params.slug }).lean()
      .then(product => { 
        res.render('users/allProducts', { title: req.params.slug, product }) })
      .catch(next)
  }
}

module.exports = new allProductsController