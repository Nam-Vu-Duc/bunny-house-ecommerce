const product    = require('../models/productModel')
const user       = require('../models/userModel')
const order      = require('../models/orderModel')
const store      = require('../models/storeModel')
const brand      = require('../models/brandModel')
const employee   = require('../models/employeeModel')
const cloudinary = require('cloudinary').v2

class adminController {
  async show(req, res, next) {
    try {
      const index = 'home';
        const [orders, products, employees] = await Promise.all([
        order.find({ deletedAt: null }).sort({ totalOrderPrice: -1 }).lean(),
        product.find().lean(),
        employee.find().lean(),
      ]);
  
      const allOrders = orders.length;
      const orderStats = orders.reduce(
        (acc, order) => {
          if (order.status === 'preparing') acc.preparingOrders++;
          if (order.status === 'delivering') acc.deliveringOrders++;
          if (order.status === 'done') acc.doneOrders++;
          return acc;
        },
        { preparingOrders: 0, deliveringOrders: 0, doneOrders: 0 }
      );
  
      const allProducts = products.length;
      const productStats = products.reduce(
        (acc, product) => {
          if (product.deletedAt !== null) acc.deletedProducts++;
          if (product.categories === 'skincare') acc.allSkincareProducts++;
          if (product.categories === 'makeup') acc.allMakeupProducts++;
          return acc;
        },
        { deletedProducts: 0, allSkincareProducts: 0, allMakeupProducts: 0 }
      );
  
      const totalRevenue = orders.reduce((sum, order) => {
        return order.status === 'done' ? sum + order.totalOrderPrice : sum;
      }, 0);
      const maxValueOrder = orders[0] || { _id: '', totalOrderPrice: 0 };
      const maxValueOrderId = maxValueOrder._id?.toString() || '';
      const maxValueOrderNumber = maxValueOrder.totalOrderPrice.toString();
  
      const totalEmployee = employees.length;
  
      res.render('admin/home', {
        title: 'Trang chủ admin',
        layout: 'admin',
        index,
        allOrders,
        ...orderStats,
        allProducts,
        ...productStats,
        totalRevenue,
        maxValueOrderId,
        maxValueOrderNumber,
        totalEmployee,
      });
    } catch (error) {
      next(error); // Forward errors to the global error handler
    }
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
        if (orderType !== '') order = order.filter(order => order.status === orderType)
        order = order.slice(skip, skip + itemsPerPage)
        const orderLength = order.length

        res.render('admin/allOrders', { title: 'Danh sách đơn hàng', layout: 'admin', orderLength, orderType, currentPage, index, order })
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
    const index        = 'products'
    const currentPage  = req.query.page || 1
    const productType  = req.query.type || ''
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage;

    product.find({ deletedAt: null }).lean()
      .then(product => { 
        if (productType !== '') product = product.filter(product => product.categories === productType)
        product = product.slice(skip, skip + itemsPerPage)
        const productLength = product.length

        res.render('admin/allProducts', { title: 'Toàn bộ sản phẩm', layout: 'admin', productLength, product, productType, currentPage, index })
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