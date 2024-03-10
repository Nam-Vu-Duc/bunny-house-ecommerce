const user = require('../models/userModel')

class profileController {
  updateProfile(req, res, next) {
    user.findOne({ _id: req.params.id }).lean()
      .then(user => {
        res.render('users/updateProfile', { title: 'Cập nhật thông tin', user })
      })
      .catch(next)
  }

  updatedProfile(req, res, next) {
    user.updateOne({ _id: req.params.id }, req.body).lean()
      .then(user => {
        res.redirect('/profile/update/:id')
      })
      .catch(next)
  }

  orders(req, res, next) {
    res.render('users/product', { title: ''  })
  }
}

module.exports = new profileController