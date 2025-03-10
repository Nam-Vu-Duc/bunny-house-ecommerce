const emp = require('../../models/employeeModel')
const store = require('../../models/storeModel')
const position = require('../../models/positionModel')
const checkForHexRegExp = require('../../middleware/checkForHexRegExp')

class profileController {
  async getProfile(req, res, next) {
    try {
      const [userInfo, storesInfo, positionsInfo] = await Promise.all([
        emp.findOne({ _id: req.cookies.uid }).lean(),
        store.find().lean(),
        position.find().lean()
      ])
      if (!userInfo) return res.json({userInfo: null})
  
      return res.json({userInfo: userInfo, storesInfo: storesInfo, positionsInfo: positionsInfo})
      
    } catch (error) {
      return res.json({error: error})
    }
  }

  async updateProfile(req, res, next) {
    if (!checkForHexRegExp(req.cookies.uid)) return res.status(403).render('partials/denyUserAccess', { title: 'Not found', layout: 'empty' })
    return res.render('admin/detail/profile', { title: 'Thông tin cá nhân', layout: 'admin' } )
  }

  async profileUpdated(req, res, next) {
    try {
      await emp.updateOne({ _id: req.cookies.uid}, {
        name   : req.body.name   ,
        phone  : req.body.phone  ,
        address: req.body.address,
        gender : req.body.gender ,
      })
  
      return res.json({isValid: true, message: 'Cập nhật thông tin thành công'})
      
    } catch (error) {
      return res.json({error: error})
    }
  }
}
module.exports = new profileController