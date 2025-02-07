const socket = io('http://localhost:3000', {
  path: "/socket.io",
})

setInterval(() => {
  socket.emit('heartbeat', { message: 'ping' });
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
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 100)
})