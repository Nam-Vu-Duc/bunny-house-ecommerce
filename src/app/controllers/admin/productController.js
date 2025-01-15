const product = require('../../models/productModel')
const cloudinary = require('cloudinary').v2

class allProductsController {
  async allProducts(req, res, next) {
    const index        = 'products'
    const successful = req.flash('successful')
    
    const currentPage  = req.query.page || 1
    const productType  = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    let products = await product.find({ deletedAt: null }).sort({ createdAt: -1, name: 1 }).lean()
    const totalProduct = products.length
    if (productType !== '') products = products.filter(product => product.categories === productType)
    products = products.slice(skip, skip + itemsPerPage)

    res.render('admin/all/product', { title: 'Danh sách sản phẩm', layout: 'admin', index, successful, totalProduct, products, productType, currentPage })
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

    const productInfo = await product.findOne({ _id: req.params.id }).lean()
    res.render('admin/detail/product', { title: product.name, layout: 'admin', index, successful, productInfo })

  }
  
  async productUpdated(req, res, next) {    
    await product.updateOne({ _id: req.params.id }, {
      categories  : req.body.categories,
      skincare    : req.body.skincare,
      makeup      : req.body.makeup,
      brand       : req.body.brand,
      oldPrice    : req.body.oldPrice,
      name        : req.body.name,
      price       : req.body.price,
      description : req.body.description,
      details     : req.body.details,
      status      : req.body.status,
      newArrival  : req.body.newArrival,
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

    const products = await product.find({ deletedAt: { $ne: null } }).lean()
    const totalDeletedProduct = products.length

    res.render('admin/all/trash', { title: 'Kho', layout: 'admin', index, successful, products, totalDeletedProduct })
  }
}
module.exports = new allProductsController