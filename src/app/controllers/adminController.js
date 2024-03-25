const product = require('../models/productModel')
const user = require('../models/userModel')
const order = require('../models/orderModel')
const cloudinary = require('cloudinary').v2
const upload = require('../middleware/cloudinary');

class adminController {
  async show(req, res, next) {
    const orders        = await order.find({ deletedAt: null }).lean()
    const products      = await product.find({ deletedAt: null }).lean()
    const maxValueOrder = await order.find({ deletedAt: null }).sort({totalOrderPrice: -1}).limit(1)

    // order info
    const allOrders        = orders.length
    const preparingOrders  = orders.filter(order => order.status === 'preparing').length
    const deliveringOrders = orders.filter(order => order.status === 'delivering').length
    const doneOrders       = orders.filter(order => order.status === 'done').length

    // product info
    const allProducts         = products.length
    const allBrands           = [...new Set(products.map(product => product.brand))].length
    const allSkincareProducts = products.filter(product => product.categories === 'skincare').length
    const allMakeupProducts   = products.filter(product => product.categories === 'makeup').length
    const deletedProducts     = products.filter(product => product.deletedAt !== null).length

    // finance info
    const totalRevenue            = orders.filter(order => order.status === 'done').map(order => order.totalOrderPrice).reduce((sum, num) => sum + num, 0)
    const totalRevenueToCurrency  = totalRevenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    const maxValueOrderId         = maxValueOrder[0]._id.toString()
    const maxValueOrderToCurrency = maxValueOrder[0].totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    res.render('admin/home', { title: 'Trang chủ admin', layout: 'admin', allOrders, preparingOrders, deliveringOrders, doneOrders, allProducts, allBrands, allSkincareProducts, allMakeupProducts, deletedProducts, totalRevenueToCurrency, maxValueOrderId, maxValueOrderToCurrency })
  }

  allOrders(req, res, next) {
    const currentPage  = req.query.page || 1
    const orderType    = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    order.find({ deletedAt: null }).lean()
      .then(order => {
        order.forEach(order => {
          order.totalOrderPrice = order.totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
        })

        let newOrder = order
        if (orderType !== '') {
          newOrder = newOrder.filter(order => order.status === orderType)
        }
        const orderLength = newOrder.length
        newOrder = newOrder.slice(skip, skip + itemsPerPage)

        res.render('admin/allOrders', { title: 'Đơn đặt hàng', layout: 'admin', orderLength, newOrder, orderType, currentPage })
      })
      .catch(next)
  }

  orderInfo(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => {
        order.products.forEach(product => {
          product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          product.totalPrice = product.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        });
        order.totalOrderPrice = order.totalOrderPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        order.createdAt = order.createdAt.getDate() + '/' + (order.createdAt.getMonth()+1) + '/' + order.createdAt.getFullYear()
        res.render('admin/order', { title: `Đơn của ${order.customerInfo.name}`, layout: 'admin', order })
      })
      .catch(next)
  }

  orderUpdated(req, res, next) {
    order.updateOne({ _id: req.params.id }, { status: req.body.status })
      .then(() => { 
        res.redirect('/admin/all-orders')})
      .catch(next)
  }

  createProduct(req, res, next) {
    res.render('admin/create', { title: 'Thêm sản phẩm mới', layout: 'admin' })
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

  allProducts(req, res, next) {
    const currentPage  = req.query.page || 1
    const productType  = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    product.find({ deletedAt: null }).lean()
      .then(product => { 
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        let newProduct = product
        if (productType !== '') {
          newProduct = newProduct.filter(product => product.categories === productType)
        }
        const productLength = newProduct.length
        newProduct = newProduct.slice(skip, skip + itemsPerPage)

        res.render('admin/allProducts', { title: 'Toàn bộ sản phẩm', layout: 'admin', productLength, newProduct, productType, currentPage })
      })
      .catch(next)
  }

  updatingProduct(req, res, next) {
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updateProduct', { title: 'Sửa sản phẩm', layout: 'admin', product } )})
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
    // newProduct.deleteOne()
    // res.redirect('back')
        // product.deleteOne()
        //   .then(() => res.redirect('back'))
  }

  restore(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: null })
      .then(() => res.redirect('/admin/all-products'))
      .catch(next)
  }

  trash(req, res, next) {
    product.find({ deletedAt: { $ne: null } }).lean()
      .then(product => { 
        product.forEach(product => product.price = product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'))
        const totalDeletedProduct = product.length
        res.render('admin/trash', { title: 'Thùng rác', layout: 'admin', product, totalDeletedProduct } )})
      .catch(next)
  }

  updateProfile(req, res, next) {
    user.findById(req.params.id).lean()
      .then(user => { res.render('admin/updateProfile', { title: 'Cập nhật thông tin cá nhân', layout: 'admin', user } )})
      .catch(next)
  }

  profileUpdated(req, res, next) {
    user.updateOne({ _id: req.params.id}, {
      'userInfo.name'   : req.body.name,
      'userInfo.phone'  : req.body.phone,
      'userInfo.gender' : req.body.gender,
      'userInfo.address': req.body.address,
    })
      .then(() => res.redirect('back'))
      .catch(next)
    // res.json(req.body)
  }
}

module.exports = new adminController