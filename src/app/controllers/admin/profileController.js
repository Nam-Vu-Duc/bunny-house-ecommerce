const emp = require('../../models/employeeModel')

class profileController {
  async getProfile(req, res, next) {
    const userInfo = await emp.findOne({ _id: req.body.id }).lean()
    if (!userInfo) return res.json({userInfo: null})
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