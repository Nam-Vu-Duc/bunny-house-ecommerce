const emp = require('../../models/employeeModel')

class profileController {
  async updateProfile(req, res, next) {
    const index      = 'profile'
    const successful = req.flash('successful')

    const userInfo = await emp.findOne({ _id: req.cookies.uid }).lean()
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
      name   : name   ,
      phone  : phone  ,
      gender : gender ,
      address: address,
    })
    
    req.flash('successful', 'Cập nhật thông tin thành công')
    res.redirect(req.get('Referrer') || '/admin')
  }
}
module.exports = new profileController