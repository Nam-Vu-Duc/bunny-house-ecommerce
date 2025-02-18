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
    const holderProducts = Array(10).fill({})
    res.render('users/allProducts', { title: 'Toàn bộ sản phẩm', holderProducts }) 
  }

  async productInfo(req, res, next) {
    const holderComments = Array(5).fill({})
    const holderRelatedProducts = Array(5).fill({})

    if (!checkForHexRegExp(req.params.id)) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
        
    return res.render('users/detailProduct', { holderComments, holderRelatedProducts })
  }
}
module.exports = new allProductsController