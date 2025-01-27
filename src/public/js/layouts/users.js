const socket = io('http://localhost:3000', {
  path: "/socket.io"
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 100)
  
  const fixedComponents = document.createElement('script')
  fixedComponents.src = '/js/partials/fixedComponents.js'
  fixedComponents.async = true
  document.head.appendChild(fixedComponents)
})