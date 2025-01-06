const store = require('../../models/storeModel')
const employee = require('../../models/employeeModel')

class allStoresController {
  async allStores(req, res, next) {
    const stores = await store.find({}).lean()
    const index  = 'stores'
    const totalStore = stores.length

    res.render('admin/all/store', { title: 'Danh sách cửa hàng', layout: 'admin', stores, totalStore, index })
  }

  async storeInfo(req, res, next) {
    const index = 'stores'
    const [storeInfo, employeesInfo] = await Promise.all([
      store.findOne({ _id: req.params.id }).lean(),
      employee.find({ 'userInfo.storeId': req.params.id }).lean(),
    ]);

    res.render('admin/detail/store', { title: store.name, layout: 'admin', storeInfo, employeesInfo, index })
  }

  async storeUpdate(req, res, next) {
    
  }

  async storeCreate(req, res, next) {
    const index = 'stores'
    res.render('admin/create/store', { title: 'Thêm cửa hàng mới', layout: 'admin', index })
  }

  async storeCreated(req, res, next) {
    
  }
}
module.exports = new allStoresController