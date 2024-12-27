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
        // const token = jwt.sign(payload, 'YOUR_STRONG_SECRET', { expiresIn: '15m' });
        const userId = getEmp._id.toString()

        res.cookie('user_id', userId, {
          httpOnly: true,
          secure: true,
        })
        res.redirect('/admin')
      } else {
        req.flash('error', 'Mật khẩu không đúng')
        return res.redirect('/authentication/sign-in')
      }
    })
  }

  signUp(req, res, next) {
    const error = req.flash('error')
    res.render('admin/createEmployee', { title: 'Tạo tài khoản nhân viên', layout: 'empty', message: error, error })
  }

  async creatingAccount(req, res, next) {
    const empExist = await emp.findOne({ 'loginInfo.email': req.body.email })
    if (empExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/authentication/sign-up')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newEmp = new emp({
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: 'employee'
      },
      userInfo: {
        name: req.body.name,
      }
    })
    const savedUser = await newEmp.save()

    res.redirect('/emp/authentication/sign-in')
  }
}
module.exports = new loginController