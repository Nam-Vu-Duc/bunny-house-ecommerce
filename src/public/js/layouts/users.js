// const socket = io("http://localhost:3100/", {path: "/socket.io"})
const socket = io("https://bunny-chat.onrender.com/", {path: "/socket.io"})

setInterval(() => {
  socket.emit('heartbeat', { message: 'user ping' })
}, 30000) // Send a ping every 30 seconds

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})