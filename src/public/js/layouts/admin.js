checkUser()

// const socket = io("http://localhost:3100/", {path: "/socket.io"})
const socket = io("https://bunny-chat.onrender.com/", {path: "/socket.io"})

async function checkUser() {
  const response = await fetch('/admin/all/data/user')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {message, data} = await response.json()

  window.isAdminLoggedIn = message
  window.admin_data = data
}

setInterval(() => {
  socket.emit('heartbeat', { message: 'admin ping' });
}, 30000); // Send a ping every 30 seconds

socket.on('order', () => {
  pushNotification('Bạn có đơn hàng mới')
})

socket.on('account', () => {
  pushNotification('Bạn có khách hàng mới')
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})