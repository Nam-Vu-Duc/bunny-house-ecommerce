const store = require('../../models/storeModel')
const employee = require('../../models/employeeModel')

class allStoresController {
  async allStores(req, res, next) {
    const index  = 'stores'
    const successful = req.flash('successful')

    const currentPage  = req.query.page || 1
    const itemsPerPage = 10;
    const skip         = (currentPage - 1) * itemsPerPage

    const [stores, totalStore] = await Promise.all([  
      store.find({}).skip(skip).limit(itemsPerPage).lean(),
      store.find({}).countDocuments()
    ])

    res.render('admin/all/store', { title: 'Danh sách cửa hàng', layout: 'admin', index, successful, stores, totalStore, currentPage })
  }

  async storeInfo(req, res, next) {
    const index = 'stores'
    const [storeInfo, employeesInfo] = await Promise.all([
      store.findOne({ _id: req.params.id }).lean(),
      employee.find({ 'userInfo.storeId': req.params.id }).lean(),
    ]);
    res.render('admin/detail/store', { title: storeInfo.name, layout: 'admin', index, storeInfo, employeesInfo })
  }

  async storeUpdate(req, res, next) {
    
  }

  async storeCreate(req, res, next) {
    const index = 'stores'
    
    res.render('admin/create/store', { title: 'Thêm cửa hàng mới', layout: 'admin', index })
  }

  async storeCreated(req, res, next) {
    const newStore = new store(req.body)

    await newStore.save()
    req.flash('successful', 'purchase successfully')
    res.redirect('/admin/all-stores')
  }
}
module.exports = new allStoresController