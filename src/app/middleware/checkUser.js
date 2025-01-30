const user = require('../models/userModel')
const jwt = require('jsonwebtoken')

module.exports = async function checkUser(req, res, next) {
  try {
    const rt = req.cookies.rt
    const uid = req.cookies.uid

    if (rt && uid) {
      const decoded = jwt.verify(rt, 'SECRET_KEY')
      if (!decoded) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
      const userInfo = await user.findOne({ _id: uid })
      if (!userInfo) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      if (userInfo.loginInfo.role !== 'user') return res.render('partials/denyAdminAccess', { title: 'Access Denied', layout: 'empty' })
      req.isUser = true
    }
    next()
  } catch (error) {
    console.error('Authentication Error:', error)
    return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
  }
}