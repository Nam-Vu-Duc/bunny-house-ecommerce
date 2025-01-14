const supplier = require('../../models/supplierModel')
const purchase = require('../../models/purchaseModel')

class allSuppliersController {
  async allSuppliers(req, res, next) {
    const index  = 'suppliers'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage

    const [suppliers, totalSupplier] = await Promise.all([
      supplier.find({}).skip(skip).limit(itemsPerPage).lean(),
      supplier.find({}).countDocuments()
    ])

    res.render('admin/all/supplier', { title: 'Danh sách đối tác', layout: 'admin', index, successful, suppliers, totalSupplier, currentPage })
  }

  async supplierInfo(req, res, next) {
    const index  = 'suppliers'
    const supplierInfo =  await supplier.findOne({ _id: req.params.id }).lean()
    const purchaseInfo = await purchase.find({ 'supplierInfo.supplierId': req.params.id }).lean()

    res.render('admin/detail/supplier', { title: supplierInfo.name, layout: 'admin', index, supplierInfo, purchaseInfo })
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

    req.flash('successful', 'update successfully')
    res.redirect(req.get('Referrer') || '/admin')
  }

  async supplierCreate(req, res, next) {
    const index  = 'suppliers'
    res.render('admin/create/supplier', { title: 'Thêm đối tác mới', layout: 'admin', index })
  }

  async supplierCreated(req, res, next) {
    const userExist = await supplier.findOne({ phone: req.body.phone })
    if (userExist) {
      req.flash('error', 'SĐT đã tồn tại')
      return res.redirect('/admin/all-suppliers/supplier/create')
    }
    const newSupplier = new supplier(req.body)

    await newSupplier.save()
    req.flash('successful', 'create successfully')
    res.redirect('/admin/all-suppliers')
  }
}
module.exports = new allSuppliersController