require('dotenv').config()
const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class loginController {
  signIn(req, res, next) {
    const error = req.flash('error')
    const successful = req.flash('successful')

    res.render('users/signIn', { title: 'Đăng Nhập', layout: 'empty', message: error, error, successful})
  }

  async checkingAccount(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    const getUser = await user.findOne({ email: email })
    if (!getUser) {
      req.flash('error', 'Email không đúng')
      return res.redirect('/authentication/sign-in')
    }

    bcrypt.compare(password, getUser.password, async function(err, result) {
      if (result) {
        const payload = { email: getUser.email }// Payload with only essential data
        const rt = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1d' })
        const at = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '7d' })
        const userId = getUser._id.toString()
        await user.updateOne({ _id: userId}, {
          isActive: true
        })

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

        if (getUser.role === 'user') {
          res.redirect('/')
        }
      } else {
        req.flash('error', 'Mật khẩu không đúng')
        return res.redirect('/authentication/sign-in')
      }
    })
  }

  signUp(req, res, next) {
    const error = req.flash('error')
    res.render('users/signUp', { title: 'Đăng Ký', layout: 'empty', message: error, error })
  }

  async creatingAccount(req, res, next) {
    const userExist = await user.findOne({ 'loginInfo.email': req.body.email })
    if (userExist) {
      req.flash('error', 'Email đã tồn tại')
      return res.redirect('/authentication/sign-up')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    let newUser = new user({
      email: req.body.email,
      password: hashedPassword,
      role: 'user',
      name: req.body.name,
    })
    const savedUser = await newUser.save()

    const adminId = process.env.ADMIN_ID
    let newChat = new chat({
      adminId: adminId,
      userId: savedUser._id,
      lastMessage: ''
    })
    await newChat.save()

    req.flash('successful', 'Tạo tài khoản thành công')
    res.redirect('/authentication/sign-in')
  }
}
module.exports = new loginController