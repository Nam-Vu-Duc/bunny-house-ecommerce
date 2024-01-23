// dark-mode toggle
// function myFunction() {
//   var element = document.body;
//   element.classList.toggle("dark-mode");
// }
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
