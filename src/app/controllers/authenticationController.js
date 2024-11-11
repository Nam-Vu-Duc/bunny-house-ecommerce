const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class loginController {
  signIn(req, res, next) {
    const error = req.flash('error')
    res.render('users/signIn', { title: 'Đăng Nhập', layout: 'empty', message: error, error})
  }

  async checkingAccount(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    user.findOne({ 'loginInfo.email':  email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Email không đúng')
          return res.redirect('/authentication/sign-in')
        }

        bcrypt.compare(password, user.loginInfo.password, function(err, result) {
          if (result) {
            const payload = { email: user.email }; // Payload with only essential data
            const token = jwt.sign(payload, 'YOUR_STRONG_SECRET', { expiresIn: '15m' });
            const userId = user._id.toString()

            res.cookie('auth_token', token, {
              // httpOnly: true,
              // secure: true,
            });

            res.cookie('user_id', userId)

            if (user.loginInfo.role === 'admin') {
              res.redirect('/admin')
            } else {
              res.redirect('/')
            }
          } else {
            // res.json({ message: 'password does not match' })
            req.flash('error', 'Mật khẩu không đúng')
            return res.redirect('/authentication/sign-in')
          }
        })
      })
      .catch(next)
  }

  signUp(req, res, next) {
    const error = req.flash('error')
    res.render('users/signUp', { title: 'Đăng Ký', layout: 'empty', message: error, error })
  }

  async creatingAccount(req, res, next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userExist = await user.findOne({ 'loginInfo.email': req.body.email });
    if (userExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/authentication/sign-up')
    }

    let newUser = new user({
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: 'user'
      },
      userInfo: {
        name: req.body.name,
      }
    })
    await newUser.save()
      .then(() => res.redirect('/authentication/sign-in'))
      .catch(next)
  }
}

module.exports = new loginController