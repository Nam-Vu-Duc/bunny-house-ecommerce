module.exports = function isAdmin(req, res, next) {
  res.status(403).send('Unauthorized'); // Deny access for non-admin users
}