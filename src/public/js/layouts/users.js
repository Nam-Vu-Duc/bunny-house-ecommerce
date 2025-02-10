const socket = io('http://localhost:3000', {
  path: "/socket.io",
})

setInterval(() => {
  socket.emit('heartbeat', { message: 'user ping' });
}, 30000) // Send a ping every 30 seconds

window.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})