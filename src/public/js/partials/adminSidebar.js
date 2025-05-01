const checkDay = {message: ''}
const index    = new URL(window.location).pathname.split('/').find(el => el.includes('all')) || []

async function getProfile() {
  // Wait until window.isAdminLoggedIn is assigned
  while (typeof window.isAdminLoggedIn === 'undefined') {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  if (!window.isAdminLoggedIn) return

  const currentTime = new Date().getHours()

  if      (currentTime <= 9) checkDay.message  = 'buổi sáng'
  else if (currentTime <= 14) checkDay.message = 'buổi trưa'
  else if (currentTime <= 18) checkDay.message = 'buổi chiều'
  else    checkDay.message = 'buổi tối'

  const helloText = `Xin chào ${window.admin_data.name}, Chúc bạn một ${checkDay.message} vui vẻ !!!`
  document.getElementById('welcome-text').innerHTML = helloText
}

document.querySelector('div.admin-button').querySelectorAll('a').forEach((a) => {
  if (index === a.id) return a.style.backgroundColor = '#FFDFDF'
})

document.querySelector('button.resize-button').onclick = function() {
  const adminSidebar = document.querySelector('div.admin-sidebar-container')
  const main = document.querySelector('main')
  const minimize = document.querySelector('i.fi-rr-cross')
  const maximize = document.querySelector('i.fi-rr-menu-burger')

  if (adminSidebar.className.includes('small')) {
    adminSidebar.classList.remove('small')
    main.style.marginLeft = '200px'
    minimize.style.display = 'block'
    maximize.style.display = 'none'
  } else {
    adminSidebar.classList.add('small')
    main.style.marginLeft = '70px'
    minimize.style.display = 'none'
    maximize.style.display = 'block'
  }
}

window.addEventListener('DOMContentLoaded', getProfile)