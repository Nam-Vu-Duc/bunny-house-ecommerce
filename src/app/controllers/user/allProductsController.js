const product = require('../../models/productModel')
const productStatuses = require('../../models/productStatusModel')
const comment = require('../../models/commentModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class allProductsController {
  async getProducts(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    if (filter.hasOwnProperty('price')) {
      filter.price = { $gt: filter.price.split('-')[0], $lt: filter.price.split('-')[1] }
    }

    const [data, productLength] = await Promise.all([
      product
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({ error: "No products found" })
    
    return res.json({data: data, data_size: productLength})
  }

  async getProduct(req, res, next) {
    const productId = req.body.productId
    const productInfo = await product.findOne({ _id: productId }).lean()
    if (!productInfo) return res.status(404).json({ error: "No products found" })
    
    return res.json({data: productInfo})
  }

  async getRelatedProducts(req, res, next) {
    const productId = req.body.productId
    const categories = req.body.categories
    const type = req.body.type
    const productInfo = await product.find({ _id: { $ne: productId }, [categories]: type }).lean().limit(5)
    if (!productInfo) return res.status(404).json({ error: "No products found" })
    
    return res.json({data: productInfo})
  }

  async getComment(req, res, next) {
    const productId = req.body.productId
    const comments = await comment.find({ productId: productId })
    if (!comments) return res.status(404).json({ error: "No comments found" })
    
    return res.json({data: comments})
  }

  async showAllProducts(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const holderProducts = Array(10).fill({})
        
    res.render('users/allProducts', { title: 'Toàn bộ sản phẩm', isUser, userId, holderProducts }) 
  }
  
  async showAllBrand(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, brand: type }

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = { $gt: queryList[key].split('-')[0], $lt: queryList[key].split('-')[1] }
      }
    }

    const [products, productLength, minPrice, maxPrice] = await Promise.all([
      product
        .find(filterOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find(filterOptions).countDocuments(),
      product.find({ deletedAt: null }).sort({ price: 1 }).limit(1).lean(),
      product.find({ deletedAt: null }).sort({ price: -1 }).limit(1).lean()
    ])

    if (productLength === 0) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

    res.render('users/allProducts', { title: 'Sản phẩm Skincare', isUser, userId, products, type, productLength, currentPage, minPrice, maxPrice })
  }

  async productInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const holderComments = Array(5).fill({})
    const holderRelatedProducts = Array(5).fill({})

    if (!checkForHexRegExp(req.params.id)) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
        
    return res.render('users/detailProduct', { isUser, userId, holderComments, holderRelatedProducts })
  }
}
module.exports = new allProductsController