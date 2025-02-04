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

    const getChat = await chat.findOne({ userId: getUser._id })
    bcrypt.compare(password, getUser.password, function(err, result) {
      if (result) {
        const payload = { email: getUser.email }// Payload with only essential data
        const rt = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '60m' })
        const at = jwt.sign(payload, 'SECRET_KEY', { expiresIn: '7d' })
        const userId = getUser ? getUser._id.toString() : ''
        const chatId = getChat ? getChat._id.toString() : ''

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
        res.cookie('chat_id', chatId, {
          httpOnly: true,
          secure: true,
        })

        if (getUser.role === 'user') {
          req.flash('sync-chat', 'sync-chat')
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

    let newChat = new chat({
      adminId: '65eddca37abb421b88771b3f',
      userId: savedUser._id
    })
    await newChat.save()

    req.flash('successful', 'Tạo tài khoản thành công')
    res.redirect('/authentication/sign-in')
  }
}
module.exports = new loginController