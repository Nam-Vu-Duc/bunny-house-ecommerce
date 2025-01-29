const user = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports = function checkAdmin(req, res, next) {
  const userId = req.cookies.user_id
  const token = req.cookies.token
  if (!token) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
  
  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
  })

  if (userId) {
    user.findOne({ _id: userId })
      .then(user => {
        if (!user) res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
        if (user.loginInfo.role !== 'user') return res.render('partials/denyAdminAccess', { title: 'Warning', layout: 'empty' })
        req.isUser = true
        next()
      })
      .catch(next)
  } else {
    next()
  }
}