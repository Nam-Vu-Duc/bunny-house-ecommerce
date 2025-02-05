class introduceController {
  show(req, res, next) { 
    const isUser = req.isUser === true ? true : false
    const userId = req.cookies.uid || null
    
    res.render('users/introduce', { title: 'Giới thiệu về mình', isUser, userId})
  }
}
module.exports = new introduceController