const emp = require('../../models/employeeModel')

class profileController {
  async updateProfile(req, res, next) {
    const index = 'profile'
    const successful = req.flash('successful')

    const userId = req.cookies.user_id
    const userInfo = await emp.findOne({ _id: userId }).lean()
    res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin', index, userInfo } )
  }

  async profileUpdated(req, res, next) {
    await emp.updateOne({ _id: req.params.id}, {
      'userInfo.name'   : req.body.name,
      'userInfo.phone'  : req.body.phone,
      'userInfo.gender' : req.body.gender,
      'userInfo.address': req.body.address,
    })
    req.flash('successful', 'update successfully')
    res.redirect('back')
  }
}
module.exports = new profileController