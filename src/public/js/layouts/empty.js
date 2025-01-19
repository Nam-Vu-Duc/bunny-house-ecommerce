window.addEventListener('load', () => {
  const preloader = document.querySelector('div.preloader')
  setTimeout(() => {
    preloader.classList.add('inactive')
  }, 200)
})