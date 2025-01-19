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
const sortMiddleware = require('./app/middleware/sortMiddleware')
const Handlebars = require('handlebars')
const { format } = require('date-fns')
const { createServer } = require("http")
const { Server } = require('socket.io')
const server = createServer(app)
const io = new Server(server, {
  path: "/socket.io"
})
const port = process.env.PORT

db.connect()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('combined'))
app.use(cookieParser())
app.use(methodOverride('_method'))
app.use(sortMiddleware)
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  defaultLayout: 'users',
  helpers: {
    addIndex: (a, b) => a + b,
    isEqual: (a, b) => a === b,
    limit: (a, b) => a.slice(0, b),
    checkStatus: (a, b, c) => a.filter(a => a.status === b).slice(0, c),
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
      if (a === 'transfer') return 'Chuyển khoản'
    },
    formatDate: (a) => a ? format(new Date(a), 'dd/MM/yyyy') : '',
    formatNumber: (a) => a ? a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND' : '0 VND',
    formatRate: (a) => a.toFixed(1),
    getLength: (a) => a.length,
    getIndexed: (a, b, c) => a[b],
  }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resource', 'views'))
app.set('view options', { layout: 'other' })

io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room)
  })

  socket.on('privateMessage', ({ room, message }) => {
    console.log(room, message)
    const id = message.split(':')[0]
    const msg = message.split(':')[1]
    io.to(room).emit('chat message', id, msg)
  })
})

//route 
route(app)
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})