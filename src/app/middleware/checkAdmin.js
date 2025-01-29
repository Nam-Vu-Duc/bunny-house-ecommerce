const emp = require('../models/employeeModel')
const jwt = require('jsonwebtoken')

module.exports = async function checkAdmin(req, res, next) {
  var userId = req.cookies.user_id
  // if (!token) return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
  if (userId) {
    const isEmp = await emp.findOne({ _id: userId })
    if (!isEmp) return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
    if (isEmp.loginInfo.role !== 'admin') return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
    next()
  } else {
    return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
  }
}