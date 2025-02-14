require('dotenv').config()
const emp = require('../../models/employeeModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer")

const verificationCode = {}

class loginController {
  signIn(req, res, next) {
    const error = req.flash('error')
    res.render('admin/signIn', { title: 'Đăng Nhập nhân viên', layout: 'empty', message: error, error})
  }

  async checkingAccount(req, res, next) {
    const email = req.body.email
    const password = req.body.password

    const getEmp = await emp.findOne({ 'email': email })
    if (!getEmp) {
      req.flash('error', 'Email không đúng')
      return res.redirect('/emp/authentication/sign-in')
    }

    bcrypt.compare(password, getEmp.password, function(err, result) {
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

  async resetPassword(req, res, next) {
    const error = req.flash('error')
    const successful = req.flash('successful')
    console.log(verificationCode)
    res.render('admin/resetPassword', { title: 'Quên mật khẩu', layout: 'empty', error, successful })
  }

  async verifyingEmail(req, res, next) {
    const userEmail     = req.body.email  
    const adminEmail    = process.env.ADMIN_EMAIL
    const adminPassword = process.env.GOOGLE_APP_EMAIL

    const emailExist = await emp.findOne({ email: userEmail})
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
      console.log(verificationCode)

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
    console.log(email, code)
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

    await emp.updateOne({ email: email}, {
      password: hashedPassword
    })

    return res.json({message: true})
  }
}
module.exports = new loginController