const isLocal = window.location.hostname === "localhost"

const socket = io(isLocal ? "http://localhost:3000" : "https://bunny-store.vercel.app/", {
  path: "/socket.io",
})

setInterval(() => {
  socket.emit('heartbeat', { message: 'admin ping' });
}, 30000); // Send a ping every 30 seconds

socket.on('order', () => {
  pushNotification('Bạn có đơn hàng mới')
  console.log('new order from front end')
})

socket.on('account', () => {
  pushNotification('Bạn có khách hàng mới')
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})