const express = require('express')
const router = express.Router()
const flash = require('connect-flash');

router.use(flash())
router.get('/', (req, res) => {
  res.clearCookie('rt', {
    httpOnly: true,
    secure: true,
  })
  res.clearCookie('uid', {
    httpOnly: true,
    secure: true,
  })
  res.clearCookie('chat_id', {
    httpOnly: true,
    secure: true,
  })
  res.redirect('/authentication/sign-in');
})

module.exports = router