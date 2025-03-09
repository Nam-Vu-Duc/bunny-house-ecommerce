const checkDay = {message: ''}
const index    = new URL(window.location).pathname.split('/').find(el => el.includes('all')) || []

async function getProfile() {
  const response = await fetch('/admin/profile/data/profile', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {userInfo} = await response.json()

  const currentTime = new Date().getHours()

  if      (currentTime <= 9) checkDay.message  = 'buổi sáng'
  else if (currentTime <= 14) checkDay.message = 'buổi trưa'
  else if (currentTime <= 18) checkDay.message = 'buổi chiều'
  else    checkDay.message = 'buổi tối'

  const helloText = `Xin chào ${userInfo.name}, Chúc bạn một ${checkDay.message} vui vẻ !!!`
  document.getElementById('welcome-text').innerHTML = helloText
}

document.querySelector('div.admin-button').querySelectorAll('a').forEach((a) => {
  if (index.includes(a.id)) return a.style.backgroundColor = '#FFDFDF'
})

document.querySelector('button.resize-button').onclick = function() {
  if (adminSidebar.className.includes('small')) {
    adminSidebar.classList.remove('small')
    main.style.marginLeft = '200px'
  }
  else {
    adminSidebar.classList.add('small')
    main.style.marginLeft = '70px'
  }
}

window.addEventListener('DOMContentLoaded', getProfile)