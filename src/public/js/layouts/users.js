tippy('[data-tippy-content]', {
  arrow: true,
  theme: 'bunny'
})

window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  preloader.classList.add('inactive')
})