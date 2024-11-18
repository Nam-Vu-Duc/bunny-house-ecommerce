const user = require('../models/userModel')

module.exports = function checkAdmin(req, res, next) {
  var token = req.cookies.auth_token
  var role  = req.cookies.user_id
  // if not logged-in, deny access to admin page
  if (!token) return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
  // if logged-in as user, deny access to admin page
  user.findOne({ _id: role })
  .then(user => {
    if (user.loginInfo.role !== 'admin') return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
    next()
  })
  .catch(next)
}