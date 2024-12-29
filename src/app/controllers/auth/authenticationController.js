const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
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

    const getUser = await user.findOne({ 'loginInfo.email': email })
    if (!getUser) {
      req.flash('error', 'Email không đúng')
      return res.redirect('/authentication/sign-in')
    }

    const getChat = await chat.findOne({ userId: getUser._id })
    bcrypt.compare(password, getUser.loginInfo.password, function(err, result) {
      if (result) {
        const payload = { email: getUser.email }; // Payload with only essential data
        const token = jwt.sign(payload, 'YOUR_STRONG_SECRET', { expiresIn: '15m' });
        const userId = getUser ? getUser._id.toString() : ''
        const chatId = getChat ? getChat._id.toString() : ''

        res.cookie('auth_token', token, {
          httpOnly: true,
          secure: true,
        });
        res.cookie('user_id', userId, {
          httpOnly: true,
          secure: true,
        })
        res.cookie('chat_id', chatId, {
          httpOnly: true,
          secure: true,
        })

        if (getUser.loginInfo.role === 'admin') {
          req.flash('sync-chat', 'sync-chat')
          res.redirect('/admin')
        } else {
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
      loginInfo: {
        email: req.body.email,
        password: hashedPassword,
        role: 'user'
      },
      userInfo: {
        name: req.body.name,
      }
    })
    const savedUser = await newUser.save()

    let newChat = new chat({
      adminId: '65eddca37abb421b88771b3f',
      userId: savedUser._id
    })
    await newChat.save()

    res.redirect('/authentication/sign-in')
  }
}
module.exports = new loginController