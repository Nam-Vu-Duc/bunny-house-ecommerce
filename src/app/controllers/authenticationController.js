const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class loginController {
  signIn(req, res, next) {
    res.render('users/signIn', { title: 'Đăng nhập', layout: 'empty' })
  }

  async checkingAccount(req, res, next) {
    var email = req.body.email
    var password = req.body.password

    user.findOne({email: email})
      .then(user => {
        bcrypt.compare(password, user.password, function(err, result) {
          if(result) {
            const payload = { email: user.email }; // Payload with only essential data
            const token = jwt.sign(payload, 'YOUR_STRONG_SECRET', { expiresIn: '15m' });

            res.cookie('auth_token', token, {
              // httpOnly: true,
              // secure: true,
            });

            if (user.role === 'admin') {
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
    res.render('users/signUp', { title: 'Đăng kí', layout: 'empty' })
  }

  async creatingAccount(req, res, next) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const userExist = await user.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    }

    let newUser = new user({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    await newUser.save()
      .then(() => res.redirect('/authentication/sign-in'))
      .catch(next)
  }
}

module.exports = new loginController