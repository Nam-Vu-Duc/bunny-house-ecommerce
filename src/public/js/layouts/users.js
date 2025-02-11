const isLocal = window.location.hostname === "localhost"

const socket = io(isLocal ? "http://localhost:3000" : "https://bunny-store.vercel.app/", {
  path: "/socket.io",
})

setInterval(() => {
  socket.emit('heartbeat', { message: 'user ping' });
}, 30000) // Send a ping every 30 seconds

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})