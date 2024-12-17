const product = require('../../models/productModel')
const cloudinary = require('cloudinary').v2

class allProductsController {
  allProducts(req, res, next) {
    const index        = 'products'
    const currentPage  = req.query.page || 1
    const productType  = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    product.find({ deletedAt: null }).lean()
      .then(product => { 
        const productLength = product.length
        if (productType !== '') product = product.filter(product => product.categories === productType)
        product = product.slice(skip, skip + itemsPerPage)

        res.render('admin/allProducts', { title: 'Danh sách sản phẩm', layout: 'admin', productLength, product, productType, currentPage, index })
      })
      .catch(next)
  }

  createProduct(req, res, next) {
    const index = 'products'
    res.render('admin/createProduct', { title: 'Thêm sản phẩm mới', layout: 'admin', index })
  }

  async productCreated(req, res, next) {
    let newProduct = new product(req.body)
    if (req.file) {
      newProduct.img.path = req.file.path
      newProduct.img.filename = req.file.filename
    }
    await newProduct.save()
      .then(() => res.redirect('/admin/all-products'))
      .catch(next)
  }

  updatingProduct(req, res, next) {
    const index = 'products'
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/product', { title: product.name, layout: 'admin', product, index } )})
      .catch(next)
  }
  
  productUpdated(req, res, next) {    
    product.updateOne({ _id: req.params.id }, {
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
      img         : {
        path      : req.file.path,
        filename  : req.file.filename
      }
    })
      .then(() => { 
        res.redirect('/admin/all-products')})
      .catch(next)
  }

  softDelete(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  async deleteProduct(req, res, next) {
    const newProduct = await product.findOne({ _id: req.params.id })
    const deleteImg = newProduct.img.filename
    
    await cloudinary.uploader.destroy(deleteImg)
    const removeProduct = await product.deleteOne({ _id: req.params.id })

    res.redirect('back')
  }

  restore(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: null })
      .then(() => res.redirect('/admin/all-products'))
      .catch(next)
  }

  trash(req, res, next) {
    const index = 'trash'
    product.find({ deletedAt: { $ne: null } }).lean()
      .then(product => { 
        const totalDeletedProduct = product.length
        res.render('admin/trash', { title: 'Kho', layout: 'admin', product, totalDeletedProduct, index })})
      .catch(next)
  }
}
module.exports = new allProductsController