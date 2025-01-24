const socket = io('http://localhost:3000', {
  path: "/socket.io"
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 100)
})