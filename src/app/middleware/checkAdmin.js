const emp = require('../models/employeeModel')

module.exports = function checkAdmin(req, res, next) {
  var userId = req.cookies.user_id
  // if (!token) return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
  if (userId) {
    emp.findOne({ _id: userId })
      .then(emp => {
        if (emp.loginInfo.role !== 'admin') return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
        next()
      })
      .catch(next)
  } else {
    next()
  }
}