const product = require('../../models/productModel')
const comment = require('../../models/commentModel')

class allProductsController {
  async showAllProducts(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.countDocuments()
    ]) 
        
    res.render('users/allProducts', { title: 'Toàn bộ sản phẩm', isUser, userId, products, type, productLength, currentPage }) 
  }

  async showAllStatus(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug || ''
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null, status: type })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: null, status: type }).countDocuments()
    ]) 
        
    res.render('users/allProducts', { title: `Sản phẩm ${type}`, isUser, userId, products, type, productLength, currentPage }) 
  }

  async showAllSkincare(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = 'skincare'
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null, categories: 'skincare' })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: null, categories: 'skincare' }).countDocuments()
    ]) 

    res.render('users/allProducts', { title: 'Sản phẩm Skincare', isUser, userId, products, type, productLength, currentPage })
  }
  
  async showAllSkincareType(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null, skincare: type })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: null, skincare: type }).countDocuments()
    ]) 

    res.render('users/allProducts', { title: 'Sản phẩm Skincare', isUser, userId, products, type, productLength, currentPage })
  }

  async showAllMakeUp(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = 'makeup'
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null, categories: 'makeup' })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: null, categories: 'makeup' }).countDocuments()
    ]) 
  
    res.render('users/allProducts', { title: 'Sản phẩm Makeup', isUser, userId, products, type, productLength, currentPage }) 
  }
  
  async showAllMakeUpType(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null

    const currentPage  = req.query.page || 1
    const type         = req.params.slug
    const sortedList   = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}

    for (var key in sortedList) {
      if (sortedList.hasOwnProperty(key) && key !== "page") {
        sortOptions[key] = parseInt(sortedList[key])
      }
    }

    const [products, productLength] = await Promise.all([
      product
        .find({ deletedAt: null, makeup: type })
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: null, makeup: type }).countDocuments()
    ]) 
  
    res.render('users/allProducts', { title: 'Sản phẩm Makeup', isUser, userId, products, type, productLength, currentPage }) 
  }

  async productInfo(req, res, next) {
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    
    const [productInfo, comments] = await Promise.all([
      product.findOne({ _id: req.params.id }).lean(),
      comment.find({ productId: req.params.id }).lean(),
    ]) 
    if (!productInfo) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
    const productType = productInfo.skincare || productInfo.makeup
    const relatedProducts = await product.find({ 
        _id: { $ne: productInfo._id }, 
        ...(productInfo.skincare ? { skincare: productType } : { makeup: productType }) 
      }).lean().limit(5);

    res.render('users/detailProduct', { title: productInfo.name , isUser, userId, productInfo, relatedProducts, productType, comments })
  }
}
module.exports = new allProductsController