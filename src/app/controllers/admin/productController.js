const product = require('../../models/productModel')
const brand = require('../../models/brandModel')
const productStatus = require('../../models/productStatusModel')
const cloudinary = require('cloudinary').v2

class allProductsController {
  async getProducts(req, res, next) {
    const currentPage  = req.body.page
    const sort         = req.body.sort
    const filter       = req.body.filter
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      product
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find(filter).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getDeletedProducts(req, res, next) {
    const currentPage  = req.body.page
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage

    const [data, dataSize] = await Promise.all([
      product
        .find({ deletedAt: { $ne: null }})
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find({ deletedAt: { $ne: null }}).countDocuments(),
    ]) 
    if (!data) res.status(404).json({data: [], data_size: 0})
    
    return res.json({data: data, data_size: dataSize})
  }

  async getProduct(req, res, next) {
    const [productInfo, brands, productStatuses] = await Promise.all([
      product.findOne({ _id: req.params.id }).lean(),
      brand.find().lean(),
      productStatus.find().lean()
    ]) 
  }

  async getFilter(req, res, next) {
    const brands = await brand.find().lean()
    res.json({brand: brands})
  }

  async allProducts(req, res, next) {
    res.render('admin/all/product', { title: 'Danh sách sản phẩm', layout: 'admin' })
  }

  async productInfo(req, res, next) {
    res.render('admin/detail/product', { layout: 'admin' })

  }

  async productUpdated(req, res, next) {    
    function deFormatNumber(number) {
      return parseInt(number.replace(/\./g, ''))
    }
    let skincare = ''
    let makeup = ''
    if (req.body.categories === 'skincare') skincare = req.body.skincare
    if (req.body.categories === 'makeup') makeup = req.body.makeup

    await product.updateOne({ _id: req.params.id }, {
      categories    : req.body.categories,
      skincare      : skincare,
      makeup        : makeup,
      brand         : req.body.brand,
      name          : req.body.name,
      purchasePrice : deFormatNumber(req.body.purchasePrice),
      oldPrice      : deFormatNumber(req.body.oldPrice),
      price         : deFormatNumber(req.body.price),
      description   : req.body.description,
      details       : req.body.details,
      quantity      : req.body.quantity,
      status        : req.body.status,
    })
  }

  async createProduct(req, res, next) {
    res.render('admin/create/product', { title: 'Thêm sản phẩm mới', layout: 'admin' })
  }

  async productCreated(req, res, next) {
    let newProduct = new product(req.body)
    if (req.file) {
      newProduct.img.path = req.file.path
      newProduct.img.filename = req.file.filename
    }
    await newProduct.save()
  }

  async softDelete(req, res, next) {
    await product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
  }

  async deleteProduct(req, res, next) {
    const newProduct = await product.findOne({ _id: req.params.id })
    const deleteImg = newProduct.img.filename
    
    await cloudinary.uploader.destroy(deleteImg)
    await product.deleteOne({ _id: req.params.id })
  }

  async restore(req, res, next) {
    await product.updateOne({ _id: req.params.id}, { deletedAt: null })
  }

  async trash(req, res, next) {
    res.render('admin/all/trash', { title: 'Kho', layout: 'admin' })
  }
}
module.exports = new allProductsController