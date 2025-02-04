const emp = require('../models/employeeModel')
const jwt = require('jsonwebtoken')

module.exports = async function checkAdmin(req, res, next) {
  try {
    const rt = req.cookies.rt
    const uid = req.cookies.uid

    if (rt && uid) {
      const decoded = jwt.verify(rt, 'SECRET_KEY')
      if (!decoded) return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
      
      const empInfo = await emp.findOne({ _id: uid })
      if (!empInfo) return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
      if (empInfo.role !== 'admin') return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
      req.isUser = true
      next()
    } else {
      return res.status(403).render('partials/denyUserAccess', { title: 'Warning', layout: 'empty' })
    }
  } catch (error) {
    console.error('Authentication Error:', error)
    return res.render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
  }
}