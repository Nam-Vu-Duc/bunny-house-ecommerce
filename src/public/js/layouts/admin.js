const socket = io('http://localhost:3000', {
  path: "/socket.io"
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 100)
})

socket.on('order', () => {
  pushNotification('Bạn có đơn hàng mới')
})

socket.on('account', () => {
  pushNotification('Bạn có khách hàng mới')
})