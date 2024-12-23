const express = require('express')
const router = express.Router()
const flash = require('connect-flash');

router.use(flash())
router.get('/', (req, res) => {
  res.clearCookie('user_id', {
    httpOnly: true,
    secure: true,
  })
  res.clearCookie('chat_id', {
    httpOnly: true,
    secure: true,
  })
  // req.flash('success', 'Logged out successfully')
  res.redirect('/authentication/sign-in');
})

module.exports = router