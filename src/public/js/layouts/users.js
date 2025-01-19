tippy('[data-tippy-content]', {
  arrow: true,
  theme: 'bunny'
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 200)
  
  const fixedComponents = document.createElement('script')
  fixedComponents.src = '/js/partials/fixedComponents.js'
  fixedComponents.async = true
  document.head.appendChild(fixedComponents)
})