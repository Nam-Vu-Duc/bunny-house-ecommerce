const product    = require('../models/productModel')
const user       = require('../models/userModel')
const order      = require('../models/orderModel')
const store      = require('../models/storeModel')
const brand      = require('../models/brandModel')
const employee   = require('../models/employeeModel')
const cloudinary = require('cloudinary').v2

class adminController {
  async show(req, res, next) {
    const index         = 'home'
    const orders        = await order.find({ deletedAt: null }).sort({totalOrderPrice: -1}).lean()
    const products      = await product.find().lean()
    // const brands        = await brand.find().lean()
    const employees     = await employee.find().lean()
    const maxValueOrder = orders[0]

    // order info
    const allOrders        = orders.length
    const { preparingOrders, deliveringOrders, doneOrders } = allOrders === 0 
    ? { preparingOrders: 0, deliveringOrders: 0, doneOrders: 0 } 
    : orders.reduce((acc, order) => {
        if (order.status === 'preparing') acc.preparingOrders++;
        else if (order.status === 'delivering') acc.deliveringOrders++;
        else if (order.status === 'done') acc.doneOrders++;
        return acc;
      }, { preparingOrders: 0, deliveringOrders: 0, doneOrders: 0 });

    // product info
    const allProducts         = products.length
    // const allBrands           = brands.length
    const { deletedProducts, allSkincareProducts, allMakeupProducts } = allProducts === 0 
    ? { deletedProducts: 0, allSkincareProducts: 0, allMakeupProducts: 0 }
    : products.reduce((acc, product) => {
        if (product.deletedAt !== null) acc.deletedProducts++;
        if (product.categories === 'skincare') acc.allSkincareProducts++;
        if (product.categories === 'makeup') acc.allMakeupProducts++;
        return acc;
      }, { deletedProducts: 0, allSkincareProducts: 0, allMakeupProducts: 0 });

    // finance info
    const totalRevenue        = orders.filter(order => order.status === 'done').map(order => order.totalOrderPrice).reduce((sum, num) => sum + num, 0)
    const maxValueOrderId     = maxValueOrder._id.toString()
    const maxValueOrderNumber = maxValueOrder.totalOrderPrice.toString()

    // employee info
    const totalEmployee = employees.length

    res.render('admin/home', { title: 'Trang chủ admin', layout: 'admin', allOrders, preparingOrders, deliveringOrders, doneOrders, allProducts, allSkincareProducts, allMakeupProducts, deletedProducts, totalRevenue, maxValueOrderId, maxValueOrderNumber, totalEmployee, index })
  }

  async allCustomers(req, res, next) {
    const index = 'customers'
    const customers = await user.find({ deletedAt: null, 'loginInfo.role': 'user' }).lean();
    const customerIds = customers.map(customer => customer._id.toString()); // Get all customer IDs

    // Find all orders for the retrieved customers
    const orders = await order.find({ 'customerInfo.userId': { $in: customerIds }, deletedAt: null }).lean();

    // Create a mapping of userId to orders
    const ordersByCustomer = {};
    orders.forEach(order => {
      const userId = order.customerInfo.userId;
      if (!ordersByCustomer[userId]) {
        ordersByCustomer[userId] = [];
      }
      ordersByCustomer[userId].push(order);
    });

    // Attach the orders to each customer
    const customersWithOrders = customers.map(customer => {
      const customerOrders = ordersByCustomer[customer._id.toString()] || [];
      const totalPrice = customerOrders.reduce((total, order) => total + order.totalOrderPrice, 0)
      return {
        ...customer,
        orders: customerOrders, // Attach orders or empty array if no orders found
        totalOrder: customerOrders.length,
        totalPrice: totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      };
    });

    const customerLength = customersWithOrders.length;
    res.render('admin/allCustomers', { title: 'Danh sách khách hàng', layout: 'admin', customersWithOrders, customerLength,index });
  }

  createCustomer(req, res, next) {
    res.render('admin/createCustomer', { title: 'Thêm khách hàng mới', layout: 'admin' })
  }

  async customerCreated(req, res, next) {
    let newCustomer = new user(req.body)

    await newCustomer.save()
      .then(() => res.redirect('/admin/all-customers'))
      .catch(next)
  }

  async customerInfo(req, res, next) {
    const index = 'customers'
    const customerInfo = await user.findOne({ _id: req.params.id }).lean()
    const orderInfo = await order.find({ 'customerInfo.userId': req.params.id, deletedAt: null }).lean()
    const totalOrder = orderInfo.length
    const totalPrice = orderInfo.reduce((total, order) => total + order.totalOrderPrice, 0)
    
    res.render('admin/customer', { title: `Thông tin khách hàng ${customerInfo.userInfo.name}`, layout: 'admin', customerInfo, orderInfo, totalOrder, totalPrice, index })
  }

  allOrders(req, res, next) {
    const index = 'orders'
    const currentPage  = req.query.page || 1
    const orderType    = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    order.find({ deletedAt: null }).lean()
      .then(order => {
        let newOrder = order
        if (orderType !== '') {
          newOrder = newOrder.filter(order => order.status === orderType)
        }
        const orderLength = newOrder.length
        newOrder = newOrder.slice(skip, skip + itemsPerPage)

        res.render('admin/allOrders', { title: 'Danh sách đơn hàng', layout: 'admin', orderLength, newOrder, orderType, currentPage, index })
      })
      .catch(next)
  }

  orderInfo(req, res, next) {
    order.findOne({ _id: req.params.id }).lean()
      .then(order => {
        const index = 'orders'
        res.render('admin/order', { title: `Đơn của ${order.customerInfo.name}`, layout: 'admin', order,index })
      })
      .catch(next)
  }

  orderUpdated(req, res, next) {
    order.updateOne({ _id: req.params.id }, { status: req.body.status })
      .then(() => { 
        res.redirect('/admin/all-orders')})
      .catch(next)
  }

  allProducts(req, res, next) {
    const index = 'products'
    const currentPage  = req.query.page || 1
    const productType  = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    product.find({ deletedAt: null }).lean()
      .then(product => { 
        let newProduct = product
        if (productType !== '') {
          newProduct = newProduct.filter(product => product.categories === productType)
        }
        const productLength = newProduct.length
        newProduct = newProduct.slice(skip, skip + itemsPerPage)

        res.render('admin/allProducts', { title: 'Toàn bộ sản phẩm', layout: 'admin', productLength, newProduct, productType, currentPage, index })
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

  allStores(req, res, next) {
    const index = 'stores'
    store.find({}).lean()
      .then(store => { 
        const totalStore = store.length
        res.render('admin/allStores', { title: 'Toàn bộ cửa hàng', layout: 'admin', store, totalStore, index })
      })
      .catch(next)
  }

  updatingProduct(req, res, next) {
    const index = 'products'
    product.findById(req.params.id).lean()
      .then(product => { res.render('admin/updateProduct', { title: 'Sửa sản phẩm', layout: 'admin', product, index } )})
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
        res.render('admin/trash', { title: 'Thùng rác', layout: 'admin', product, totalDeletedProduct, index })})
      .catch(next)
  }

  updateProfile(req, res, next) {
    const index = 'update-profile'
    user.findById(req.params.id).lean()
      .then(user => { res.render('admin/updateProfile', { title: 'Cập nhật thông tin cá nhân', layout: 'admin', user, index } )})
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