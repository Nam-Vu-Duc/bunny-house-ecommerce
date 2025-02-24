require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const handlebars = require('express-handlebars')
const path = require('path')
const methodOverride = require('method-override')
const app = express()
const route = require('./routes')
const db = require('./config/db')
const Handlebars = require('handlebars')
const { format } = require('date-fns')
const { createServer } = require("http")
const { Server } = require('socket.io')
const server = createServer(app)
const port = process.env.PORT

db.connect()
app.use(express.json({ limit: '50mb' }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('combined'))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'users',
  helpers: {
    addIndex: (a, b) => a + b,
    isEqual: (a, b) => a === b,
    formatStatus: (a) => {
      if(a === 'preparing')   return 'Đang chuẩn bị đơn hàng'
      if(a === 'delivering')  return 'Đang giao đơn hàng'
      if(a === 'done')        return 'Hoàn thành đơn hàng'
      if(a === 'cancel')      return 'Huỷ đơn hàng'
    },
    formatRole: (a) => {
      if (a === 'admin')    return 'Quản trị viên'
      if (a === 'manager')  return 'Quản lý'
      if (a === 'employee') return 'Nhân viên'
    },
    formatPaymentMethod: (a) => {
      if (a === 'cash')     return 'Tiền mặt'
      if (a === 'transfer') return 'Chuyển khoản ngân hàng'
      if (a === 'e-wallet') return 'Ví điện tử'
    },
    formatDate: (a) => a ? format(new Date(a), 'dd/MM/yyyy') : '',
    formatNumber: (a) => a ? a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND' : '0 VND',
    formatRate: (a) => a.toFixed(1),
    formatMember: (a) => {
      if (a === 'silver')   return 'Bạc'
      if (a === 'gold')     return 'Vàng'
      if (a === 'diamond')  return 'Kim cương'
    },
    getLength: (a) => a.length,
    getIndexed: (a, b, c) => a[b],
    holderData: (a) => Array(a).fill({})
  } 
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource', 'views'))
app.set('view options', { layout: 'other' })

//route 
route(app)
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})