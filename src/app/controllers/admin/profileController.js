const emp = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const position = require('../../models/positionModel')

class profileController {
  async getProfile(req, res, next) {
    const [userInfo, storesInfo, positionsInfo] = await Promise.all([
      emp.findOne({ _id: req.cookies.uid }).lean(),
      store.find().lean(),
      position.find().lean()
    ])
    if (!userInfo) return res.json({userInfo: null})

    return res.json({userInfo: userInfo, storesInfo: storesInfo, positionsInfo: positionsInfo})
  }

  async updateProfile(req, res, next) {
    res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin' } )
  }

  async profileUpdated(req, res, next) {
    const {
      name,
      phone,
      address,
      gender,
    } = req.body

    await emp.updateOne({ _id: req.params.id}, {
      name   : name   ,
      phone  : phone  ,
      gender : gender ,
      address: address,
    })
  }
}
module.exports = new profileController