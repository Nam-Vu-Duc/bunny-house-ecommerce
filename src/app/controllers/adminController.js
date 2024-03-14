const product = require('../models/productModel')
const user = require('../models/userModel')
const order = require('../models/orderModel')

class adminController {
  show(req, res, next) {
    res.render('admin/home', { title: 'Trang chủ admin', layout: 'admin' })
  }

  allOrders(req, res, next) {
    order.find({ deletedAt: null }).lean()
      .then(order => {
        for (let i = 0; i < order.length; ++i) {
          order[i].totalProductPrice = order[i].totalProductPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
          order[i].createdAt = order[i].createdAt.getDate() + '/' + (order[i].createdAt.getMonth()+1) + '/' + order[i].createdAt.getFullYear()
          if (order[i].status === 'preparing') {
            order[i].status = 'Đang Xử Lý'
          } 
          if (order[i].status === 'delivering') {
            order[i].status = 'Đang Giao Cho Khách'
          } 
          if (order[i].status === 'done') {
            order[i].status = 'Đã Hoàn Thành'
          } 
        }

        const totalOrders = order.length
        res.render('admin/allOrders', { title: 'Đơn đặt hàng', layout: 'admin', order, totalOrders })
      })
      .catch(next)
  }

  orderInfo(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => {
        order.totalProductPrice = order.totalProductPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        const title = 'Đơn của ' + order.customerInfo.name
        res.render('admin/order', { title: title, layout: 'admin', order })
      })
      .catch(next)
  }

  orderUpdated(req, res, next) {
    // order.findById(req.params.id).lean()
    //   .then(user => { res.render('admin/updateProfile', { title: 'Cập nhật thông tin cá nhân', layout: 'admin', user } )})
    //   .catch(next)
    res.json(req.body)
  }

  createProduct(req, res, next) {
    res.render('admin/create', { title: 'Thêm sản phẩm mới', layout: 'admin' })
  }

  async productCreated(req, res, next) {
    let newProduct = new product(req.body)
    if (req.file) {
      newProduct.avatar = req.file.filename
    }
    await newProduct.save()
      .then(() => res.redirect('/admin/all-products'))
      .catch(next)
  }

  allProducts(req, res, next) {
    const currentPage = req.query.page || 1
    const productType = req.query.type || ''
    const itemsPerPage = 10;
    const skip = (currentPage - 1) * itemsPerPage;

    product.find({ deletedAt: null }).lean().sortable(req)
      .then(product => { 
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
    product.updateOne({ _id: req.params.id }, req.body)
      .then(() => { 
        res.redirect('/admin/all-products')})
      .catch(next)
  }

  softDelete(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: Date.now() })
      .then(() => res.redirect('back'))
      .catch(next)
  }

  deleteProduct(req, res, next) {
    product.deleteOne({ _id: req.params.id})
      .then(() => res.redirect('back'))
      .catch(next)
  }

  restore(req, res, next) {
    product.updateOne({ _id: req.params.id}, { deletedAt: null })
      .then(() => res.redirect('/admin/all-products'))
      .catch(next)
  }

  trash(req, res, next) {
    product.find({ deletedAt: { $ne: null } }).lean()
      .then(product => { 
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
    res.json(req.body)
  }
}

module.exports = new adminController