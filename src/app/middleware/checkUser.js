const user = require('../models/userModel')

module.exports = function checkAdmin(req, res, next) {
  var userId = req.cookies.user_id
  // if logged-in as user, deny access to admin page
  if (userId) {
    user.findOne({ _id: userId })
      .then(user => {
        if (user.loginInfo.role !== 'user') return res.render('partials/denyAdminAccess', { title: 'Warning', layout: 'empty' })
        req.isUser = true
        next()
      })
      .catch(next)
  } else {
    next()
  }
}