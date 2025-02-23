const emp = require('../../models/employeeModel')

class profileController {
  async getProfile(req, res, next) {
    
  }

  async updateProfile(req, res, next) {
    const userInfo = await emp.findOne({ _id: req.cookies.uid }).lean()
    res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin', userInfo } )
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