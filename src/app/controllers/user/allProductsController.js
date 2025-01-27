const product = require('../../models/productModel')
const comment = require('../../models/commentModel')

class allProductsController {
  async showAllProducts(req, res, next) {
    const isUser = req.isUser === true ? true : false

    const currentPage  = req.query.page   || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    let products = await product.find({ deletedAt: null }).sort({ createdAt: -1 }).lean()

    const filters = {
      'flash-sale' : { filter: product => product.status     === 'flash-sale' },
      'hot'        : { filter: product => product.status     === 'hot'        },
      'new-arrival': { filter: product => product.newArrival === 'yes'        },
      'skincare'   : { filter: product => product.skincare   !== ''           },
      'makeup'     : { filter: product => product.makeup     !== ''           }
    }
    const sortFields = [
      'price',
      'rate',
      'saleNumber'
    ]

    if (type in filters) products = products.filter(filters[type].filter)

    sortFields.forEach((field) => {
      if (sortedList[field]) {
        products = products.sort((a, b) => {
          if (sortedList[field] === 'asc') return a[field] - b[field] 
          if (sortedList[field] === 'desc') return b[field] - a[field]
        })
      }
    })
    const productLength = products.length
    products = products.slice(skip, skip + itemsPerPage)
        
    res.render('users/allProducts', { title: 'Toàn bộ sản phẩm', isUser, products, type, productLength, currentPage }) 
  }

  async showAllSkincare(req, res, next) {
    const isUser = req.isUser === true ? true : false

    const currentPage  = req.query.page   || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortFields = [
      'price',
      'rate',
      'saleNumber'
    ]

    let products = await product.find({ deletedAt: null, skincare: type }).lean()
    sortFields.forEach((field) => {
      if (sortedList[field]) {
        products = products.sort((a, b) => {
          if (sortedList[field] === 'asc') return a[field] - b[field] 
          if (sortedList[field] === 'desc') return b[field] - a[field]
        })
      }
    })
    const productLength = products.length
    products = products.slice(skip, skip + itemsPerPage)

    res.render('users/allProducts', { title: 'Sản phẩm Skincare', isUser, products, type, productLength, currentPage })
  }

  async showAllMakeUp(req, res, next) {
    const isUser = req.isUser === true ? true : false
    
    const currentPage  = req.query.page   || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortFields = [
      'price',
      'rate',
      'saleNumber'
    ]

    let products = await product.find({ deletedAt: null, makeup: type }).lean()
    sortFields.forEach((field) => {
      if (sortedList[field]) {
        products = products.sort((a, b) => {
          if (sortedList[field] === 'asc') return a[field] - b[field] 
          if (sortedList[field] === 'desc') return b[field] - a[field]
        })
      }
    })
    const productLength = products.length
    products = products.slice(skip, skip + itemsPerPage)
  
    res.render('users/allProducts', { title: 'Sản phẩm Makeup', isUser, products, type, productLength, currentPage }) 
  }

  async productInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    
    const [productInfo, comments] = await Promise.all([
      product.findOne({ _id: req.params.id }).lean(),
      comment.find({ productId: req.params.id }).lean()
    ]) 
    if (!productInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
    const productType = productInfo.skincare || productInfo.makeup
    const relatedProducts = await product.find({ 
        _id: { $ne: productInfo._id }, 
        ...(productInfo.skincare ? { skincare: productType } : { makeup: productType }) 
      }).lean().limit(5);

    res.render('users/detailProduct', { title: productInfo.name , isUser, productInfo, relatedProducts, productType, comments })
  }
}
module.exports = new allProductsController