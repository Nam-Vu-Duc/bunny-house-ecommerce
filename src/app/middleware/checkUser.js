const user = require('../models/userModel')

module.exports = function checkAdmin(req, res, next) {
  var role = req.cookies.user_id
  // if logged-in as user, deny access to admin page
  if (role) {
    user.findOne({ _id: role })
      .then(user => {
        if (user.loginInfo.role !== 'user') return res.render('partials/denyAdminAccess', { title: 'Warning', layout: 'empty' })
        next()
      })
      .catch(next)
  } else {
    next()
  }
}