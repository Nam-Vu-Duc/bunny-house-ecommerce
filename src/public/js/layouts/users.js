const socket = io('http://localhost:3000', {
  path: "/socket.io",
})

setInterval(() => {
  socket.emit('heartbeat', { message: 'ping' });
}, 30000); // Send a ping every 30 seconds

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 100)
})