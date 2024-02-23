const user = require('../models/userModel')

module.exports = function checkAdmin(req, res, next) {
  var token = req.cookies.auth_token
  var role = req.cookies.user_id
  
  // if not logged-in, deny access to admin page
  if (!token) {
    return res.json({ message: 'you do not have permission'})
  } 

  // if logged-in as user, deny access to admin page
  user.findOne({ _id: role })
  .then(user => {
    if (user.role !== 'admin') {
      return res.json({ message: 'you do not have permission'})
    }
    next()
  })
  .catch(next)
}