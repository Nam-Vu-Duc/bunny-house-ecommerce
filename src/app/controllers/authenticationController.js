class loginController {
  signIn(req, res, next) {
    res.render('users/signIn', { title: 'Đăng nhập', layout: 'empty' })
  }

  signUp(req, res, next) {
    res.render('users/signUp', { title: 'Đăng kí', layout: 'empty' })
  }
}

module.exports = new loginController