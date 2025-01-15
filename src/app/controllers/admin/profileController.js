const emp = require('../../models/employeeModel')

class profileController {
  async updateProfile(req, res, next) {
    const index = 'profile'
    const successful = req.flash('successful')

    const userId = req.cookies.user_id
    const userInfo = await emp.findOne({ _id: userId }).lean()
    res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin', index, successful, userInfo } )
  }

  async profileUpdated(req, res, next) {
    const {
      name,
      phone,
      address,
      gender,
    } = req.body

    await emp.updateOne({ _id: req.params.id}, {
      'userInfo.name'   : name,
      'userInfo.phone'  : phone,
      'userInfo.gender' : gender,
      'userInfo.address': address,
    })
    
    req.flash('successful', 'Cập nhật thông tin thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }
}
module.exports = new profileController