const product = require('../../models/productModel')
const brand = require('../../models/brandModel')
const productStatus = require('../../models/productStatusModel')
const cloudinary = require('cloudinary').v2

class allProductsController {
  async allProducts(req, res, next) {
    const index        = 'products'
    const successful   = req.flash('successful')
    
    const currentPage  = req.query.page || 1
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= { deletedAt: null }

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = queryList[key]
      }
    }

    const [products, totalProduct, brands] = await Promise.all([
      product
        .find(filterOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(itemsPerPage)
        .lean(),
      product.find(filterOptions).countDocuments(),
      brand.find().lean()
    ])

    res.render('admin/all/product', { title: 'Danh sách sản phẩm', layout: 'admin', index, successful, totalProduct, products, brands, currentPage })
  }

  createProduct(req, res, next) {
    const index = 'products'
    res.render('admin/create/product', { title: 'Thêm sản phẩm mới', layout: 'admin', index })
  }

  async productCreated(req, res, next) {
    let newProduct = new product(req.body)
    if (req.file) {
      newProduct.img.path = req.file.path
      newProduct.img.filename = req.file.filename
    }
    await newProduct.save()

    req.flash('successful', 'Thêm sản phẩm thành công')
    res.redirect('/admin/all-products')
  }

  async productInfo(req, res, next) {
    const index = 'products'
    const successful = req.flash('successful')

    const [productInfo, brands, productStatuses] = await Promise.all([
      product.findOne({ _id: req.params.id }).lean(),
      brand.find().lean(),
      productStatus.find().lean()
    ]) 
    res.render('admin/detail/product', { title: productInfo.name, layout: 'admin', index, successful, productInfo, brands, productStatuses })

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

    req.flash('successful', 'Cập nhật sản phẩm thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }

  async softDelete(req, res, next) {
    await product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
    
    req.flash('successful', 'Thêm sản phẩm vào kho thành công')
    res.redirect('/admin/all-products')
  }

  async deleteProduct(req, res, next) {
    const newProduct = await product.findOne({ _id: req.params.id })
    const deleteImg = newProduct.img.filename
    
    await cloudinary.uploader.destroy(deleteImg)
    await product.deleteOne({ _id: req.params.id })

    req.flash('successful', 'Xoá sản phẩm thành công')
    res.redirect('/admin/all-products')
  }

  async restore(req, res, next) {
    await product.updateOne({ _id: req.params.id}, { deletedAt: null })
    
    req.flash('successful', 'Phục hồi sản phẩm thành công')
    res.redirect('/admin/all-products')
  }

  async trash(req, res, next) {
    const index = 'trash'
    const successful = req.flash('successful')

    const [products, totalDeletedProduct] = await Promise.all([
      product.find({ deletedAt: { $ne: null } }).sort({ deletedAt: -1, name: 1 }).skip(skip).limit(itemsPerPage).lean(),
      product.find({ deletedAt: null }).countDocuments()
    ])

    res.render('admin/all/trash', { title: 'Kho', layout: 'admin', index, successful, products, totalDeletedProduct })
  }
}
module.exports = new allProductsController