module.exports = function checkAdmin(req, res, next) {
  var role = req.role
  if (role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Unauthorized access: Admin role required' });
  }
}