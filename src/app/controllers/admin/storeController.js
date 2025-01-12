const store = require('../../models/storeModel')
const employee = require('../../models/employeeModel')

class allStoresController {
  async allStores(req, res, next) {
    const index  = 'stores'
    const successful = req.flash('successful')

    const stores = await store.find({}).lean()
    const totalStore = stores.length

    res.render('admin/all/store', { title: 'Danh sách cửa hàng', layout: 'admin', index, stores, totalStore, successful })
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