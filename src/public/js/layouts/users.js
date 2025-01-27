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

window.onscroll = function() {
  if (document.documentElement.scrollTop > 50) {
    document.getElementById("myP").className = "test";
  } else {
    document.getElementById("myP").className = "";
  }
}