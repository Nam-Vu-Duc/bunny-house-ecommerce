class homeController {
  // get /home
  index(req, res) {
    res.render('home')
  }
}

module.exports = new homeController