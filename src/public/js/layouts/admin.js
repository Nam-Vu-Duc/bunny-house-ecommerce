var resizeButton  = document.querySelector('button.resize-button')
var adminSidebar  = document.querySelector('div.admin-sidebar-container')
var main          = document.querySelector('main')

tippy('[data-tippy-content]', {
  arrow: true,
  theme: 'bunny'
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})

resizeButton.onclick = function() {
  if (adminSidebar.className.includes('small')) {
    adminSidebar.classList.remove('small')
    main.style.marginLeft = '200px'
  }
  else {
    adminSidebar.classList.add('small')
    main.style.marginLeft = '70px'
  }
}