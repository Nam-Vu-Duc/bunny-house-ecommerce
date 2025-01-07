const emp = require('../../models/employeeModel')

class profileController {
  async updateProfile(req, res, next) {
    const index = 'profile'
    const userId = req.cookies.user_id
    const userInfo = await emp.findOne({ _id: userId }).lean()
    res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin', userInfo, index } )
  }

  async profileUpdated(req, res, next) {
    await emp.updateOne({ _id: req.params.id}, {
      'userInfo.name'   : req.body.name,
      'userInfo.phone'  : req.body.phone,
      'userInfo.gender' : req.body.gender,
      'userInfo.address': req.body.address,
    })
    res.redirect('back')
  }
}
module.exports = new profileController