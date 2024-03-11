const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class loginController {
  signIn(req, res, next) {
    res.render('users/signIn', { title: 'Đăng Nhập', layout: 'empty' })
  }

  async checkingAccount(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    user.findOne({ 'loginInfo.email':  email })
      .then(user => {
        bcrypt.compare(password, user.loginInfo.password, function(err, result) {
          if(result) {
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
              res.redirect('/home')
            }
          } else {
            res.json({ message: 'password does not match' })
          }
        })
      })
      .catch(next)
  }

  signUp(req, res, next) {
    res.render('users/signUp', { title: 'Đăng Ký', layout: 'empty' })
  }

  async creatingAccount(req, res, next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userExist = await user.findOne({ 'loginInfo.email': req.body.email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
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