const user = require('../../models/userModel')

class profileController {
  updateProfile(req, res, next) {
    const index = 'update-profile'
    user.findById(req.params.id).lean()
      .then(user => { res.render('admin/profile', { title: 'Thông tin cá nhân', layout: 'admin', user, index } )})
      .catch(next)
  }

  profileUpdated(req, res, next) {
    user.updateOne({ _id: req.params.id}, {
      'userInfo.name'   : req.body.name,
      'userInfo.phone'  : req.body.phone,
      'userInfo.gender' : req.body.gender,
      'userInfo.address': req.body.address,
    })
      .then(() => res.redirect('back'))
      .catch(next)
  }
}
module.exports = new profileController