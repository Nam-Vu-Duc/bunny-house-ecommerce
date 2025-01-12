const supplier = require('../../models/supplierModel')
const purchase = require('../../models/purchaseModel')

class allSuppliersController {
  async allSuppliers(req, res, next) {
    const index  = 'suppliers'
    const successful = req.flash('successful')

    const suppliers = await supplier.find({}).lean()
    const totalSupplier = suppliers.length

    res.render('admin/all/supplier', { title: 'Danh sách đối tác', layout: 'admin', index, suppliers, totalSupplier, successful })
  }

  async supplierInfo(req, res, next) {
    const index  = 'suppliers'
    const supplierInfo =  await supplier.findOne({ _id: req.params.id }).lean()
    const purchaseInfo = await purchase.find({ 'supplierInfo.supplierId': req.params.id }).lean()

    res.render('admin/detail/supplier', { title: supplierInfo.name, layout: 'admin', index, supplierInfo, purchaseInfo })
  }

  async supplierUpdate(req, res, next) {
    
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