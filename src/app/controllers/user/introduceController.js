class introduceController {
  show(req, res, next) { res.render('users/introduce', { title: 'Giới thiệu về mình',})}
}
module.exports = new introduceController