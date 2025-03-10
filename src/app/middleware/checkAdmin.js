const emp = require('../models/employeeModel')
const jwt = require('jsonwebtoken')

module.exports = async function checkAdmin(req, res, next) {
  try {
    const rt = req.cookies.rt
    const uid = req.cookies.uid

    if (rt && uid) {
      const decoded = jwt.verify(rt, 'SECRET_KEY')
      if (!decoded) throw new Error('error')
      
      const empInfo = await emp.findOne({ _id: uid })
      if (!empInfo) throw new Error('error')
      if (empInfo.role !== 'admin') throw new Error('error')
      next()
    } else {
      throw new Error('error')
    }
  } catch (error) {
    return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
  }
}