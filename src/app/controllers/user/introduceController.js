class introduceController {
  show(req, res, next) { 
    const isUser = req.isUser === true ? true : false
    res.render('users/introduce', { title: 'Giới thiệu về mình', isUser})
  }
}
module.exports = new introduceController