const supplier = require('../../models/supplierModel')
const purchase = require('../../models/purchaseModel')

class allSuppliersController {
  async allSuppliers(req, res, next) {
    const index        = 'suppliers'
    const successful   = req.flash('message')

    const currentPage  = req.query.page || 1
    const queryList    = req.query
    const itemsPerPage = 10
    const skip         = (currentPage - 1) * itemsPerPage
    const sortOptions  = {}
    const filterOptions= {}

    for (var key in queryList) {
      if (queryList.hasOwnProperty(key) && key.includes('sort_')) {
        sortOptions[key.slice(5)] = parseInt(queryList[key])
      }
      if (queryList.hasOwnProperty(key) && key.includes('filter_')) {
        filterOptions[key.slice(7)] = queryList[key]
      }
    }

    const [suppliers, totalSupplier] = await Promise.all([
      supplier
      .find(filterOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(itemsPerPage)
      .lean(),
      supplier.find(filterOptions).countDocuments()
    ])

    res.render('admin/all/supplier', { title: 'Danh sách đối tác', layout: 'admin', index, successful, suppliers, totalSupplier, currentPage })
  }

  async supplierInfo(req, res, next) {
    const index  = 'suppliers'
    const successful = req.flash('successful')

    const supplierInfo =  await supplier.findOne({ _id: req.params.id }).lean()
    const purchaseInfo = await purchase.find({ 'supplierId': req.params.id }).lean()

    res.render('admin/detail/supplier', { title: supplierInfo.name, layout: 'admin', index, successful, supplierInfo, purchaseInfo })
  }

  async supplierUpdate(req, res, next) {
    const {
      name,
      email,
      phone,
      address
    } = req.body

    await supplier.updateOne({ _id: req.params.id }, {
      name    : name    ,
      phone   : phone   ,
      email   : email   ,
      address : address ,
    })

    req.flash('successful', 'Cập nhật đối tác thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }

  async supplierCreate(req, res, next) {
    const index  = 'suppliers'
    const successful   = req.flash('message')
    
    res.render('admin/create/supplier', { title: 'Thêm đối tác mới', layout: 'admin', index, successful })
  }

  async supplierCreated(req, res, next) {
    const userExist = await supplier.findOne({ phone: req.body.phone })
    if (userExist) {
      req.flash('message', 'SĐT đã tồn tại')
      return res.redirect('/admin/all-suppliers/supplier/create')
    }
    const newSupplier = new supplier(req.body)

    await newSupplier.save()
    req.flash('message', 'Thêm đối tác thành công')
    res.redirect('/admin/all-suppliers')
  }
}
module.exports = new allSuppliersController