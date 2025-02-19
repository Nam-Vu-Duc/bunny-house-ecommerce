require('dotenv').config()
const user = require('../../models/userModel')
const chat = require('../../models/chatModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

const verificationCode = {}

class loginController {  
  async signIn(req, res, next) {
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

  async signUp(req, res, next) {
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

  async resetPassword(req, res, next) {
    const error = req.flash('error')
    const successful = req.flash('successful')
    res.render('users/resetPassword', { title: 'Quên mật khẩu', layout: 'empty', error, successful })
  }

  async verifyingEmail(req, res, next) {
    const userEmail     = req.body.email  
    const adminEmail    = process.env.ADMIN_EMAIL
    const adminPassword = process.env.GOOGLE_APP_EMAIL

    const emailExist = await user.findOne({ email: userEmail})
    if (!emailExist) {
      return res.json({message: false})
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false, // true for port 465, false for other ports
      auth: {
        user: adminEmail,
        pass: adminPassword,
      },
    })

    function generateResetCode() {
      return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit code
    }
    
    // async..await is not allowed in global scope, must use a wrapper
    async function sendEmail(userEmail) {
      const resetCode = generateResetCode()
      verificationCode[userEmail] = resetCode

      await transporter.sendMail({
        from: adminEmail, 
        to: userEmail, 
        subject: "Mã xác nhận thay đổi mật khẩu", 
        text: "Đây là mã thay đổi mật khẩu của bạn: " + resetCode, 
      })
    }

    await sendEmail(userEmail)
    res.json({message: true})
  }

  async verifyingCode(req, res, next) {
    const email = req.body.email
    const code  = req.body.code
    if (verificationCode[email] && verificationCode[email] === code) {
      delete verificationCode[email] // Remove code after verification
      return res.json({message: true})
    }
    return res.json({message: false})
  }

  async resettingPassword(req, res, next) {
    const email = req.body.email
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await user.updateOne({ email: email}, {
      password: hashedPassword
    })

    return res.json({message: true})
  }
}
module.exports = new loginController