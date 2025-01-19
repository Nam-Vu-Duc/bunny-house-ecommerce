var adminSidebar  = document.querySelector('div.admin-sidebar-container')
var main          = document.querySelector('main')

tippy('[data-tippy-content]', {
  arrow: true,
  theme: 'bunny'
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 200)
})