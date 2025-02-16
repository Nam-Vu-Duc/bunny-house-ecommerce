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

    console.log(sort)

    const [data, productLength] = await Promise.all([
      product
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find(filter).countDocuments(),
    ]) 
    if (!data) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    res.json({data: data, data_size: productLength})
  }

  async showAllProducts(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    const holderProducts = Array(10).fill({})
        
    res.render('users/allProducts', { title: 'Toàn bộ sản phẩm', isUser, userId, holderProducts }) 
  }

  async showAllStatus(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug || ''
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, status: type }

    const productStatus = await productStatuses.find().lean()
    const isValidStatus = productStatus.some((status) => status.code === type)

    if (!isValidStatus) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })

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
        
    res.render('users/allProducts', { title: `Sản phẩm ${type}`, isUser, userId, products, type, productLength, currentPage, minPrice, maxPrice }) 
  }

  async showAllSkincare(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = 'skincare'
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, categories: 'skincare' }

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

    res.render('users/allProducts', { title: 'Sản phẩm Skincare', isUser, userId, products, type, productLength, currentPage, minPrice, maxPrice })
  }
  
  async showAllSkincareType(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, skincare: type }

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

  async showAllMakeUp(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = 'makeup'
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, categories: 'makeup' }

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
  
    res.render('users/allProducts', { title: 'Sản phẩm Makeup', isUser, userId, products, type, productLength, currentPage, minPrice, maxPrice }) 
  }
  
  async showAllMakeUpType(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null, makeup: type }

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
  
    res.render('users/allProducts', { title: 'Sản phẩm Makeup', isUser, userId, products, type, productLength, currentPage, minPrice, maxPrice }) 
  }
  
  async showAllBrandType(req, res, next) {
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

    if (!checkForHexRegExp(req.params.id)) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    
    const [productInfo, comments] = await Promise.all([
      product.findOne({ _id: req.params.id }).lean(),
      comment.find({ productId: req.params.id }).lean(),
    ]) 
    if (!productInfo) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
    const productType = productInfo.skincare || productInfo.makeup
    const relatedProducts = await product.find({ 
        _id: { $ne: productInfo._id }, 
        ...(productInfo.skincare ? { skincare: productType } : { makeup: productType }) 
      }).lean().limit(5)

    return res.render('users/detailProduct', { title: productInfo.name , isUser, userId, productInfo, relatedProducts, productType, comments })
  }
}
module.exports = new allProductsController