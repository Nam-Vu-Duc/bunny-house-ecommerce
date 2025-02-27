const resizeButton        = document.querySelector('button.resize-button')
const currentTime         = new Date().getHours()
const checkDay            = {message: ''}
const index               = new URL(window.location).pathname.split('/').find(el => el.includes('all')) || []

console.log(index)

document.querySelector('div.admin-button').querySelectorAll('a').forEach((a) => {
  if (a.id === index) a.style.backgroundColor = '#FFDFDF'
  // if (!index) 
})

if      (currentTime <= 9) checkDay.message  = 'buổi sáng'
else if (currentTime <= 14) checkDay.message = 'buổi trưa'
else if (currentTime <= 18) checkDay.message = 'buổi chiều'
else    checkDay.message = 'buổi tối'

const helloText = `Xin chào Quỳnh Ly, Chúc bạn một ${checkDay.message} vui vẻ !!!`
document.getElementById('welcome-text').innerHTML = helloText

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