module.exports = function checkAdmin(req, res, next) {
  var token = req.cookies.auth_token
  if (!token) {
    res.json({ message: 'you do not have permission'})
  } else {
    next()
  }
}