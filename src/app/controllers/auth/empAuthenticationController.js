const emp = require('../../models/employeeModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class loginController {
  signIn(req, res, next) {
    const error = req.flash('error')
    res.render('admin/signIn', { title: 'Đăng Nhập nhân viên', layout: 'empty', message: error, error})
  }

  async checkingAccount(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    const getEmp = await emp.findOne({ 'loginInfo.email': email })
    if (!getEmp) {
      req.flash('error', 'Email không đúng')
      return res.redirect('/emp/authentication/sign-in')
    }

    bcrypt.compare(password, getEmp.loginInfo.password, function(err, result) {
      if (result) {
        const payload = { email: getEmp.email }; // Payload with only essential data
        const rt = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1d' })
        const at = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '7d' })
        const userId = getEmp._id.toString()

        res.cookie('rt', rt, {
          httpOnly: true,
          secure: true,
        })
        res.cookie('at', at, {
          httpOnly: true,
          secure: true,
        })
        res.cookie('uid', userId, {
          httpOnly: true,
          secure: true,
        })
        req.flash('successful', 'Đăng nhập thành công')
        return res.redirect('/admin')
      } else {
        req.flash('error', 'Mật khẩu không đúng')
        return res.redirect('/emp/authentication/sign-in')
      }
    })
  }
}
module.exports = new loginController