// ok
const header          = document.querySelector('header')
const ordersQuantity  = document.querySelector('span.orders-quantity')
const searchIcon      = document.querySelector('i.fi-br-search')
const searchInput     = document.querySelector('input#search-input')
const avatar          = document.querySelector('img.dropdown-avatar')
const avatarMenu      = document.querySelector('div.avatar-menu')
const menu            = document.querySelector('div.menu')
const responsiveMenu  = document.querySelector('div.responsive-menu')
const isUserHeader    = {message: false}
var width = window.innerWidth

window.addEventListener('scroll', function() {
  document.documentElement.scrollTop > 0 ? header.classList.add('scroll') : header.classList.remove('scroll')
})

window.addEventListener("resize", function() {
  width = window.innerWidth
  setDisplay(width, menu)
})

document.addEventListener('cartUpdated', updateCartCount)

document.addEventListener('click', function(event) {
  if (!event.target.matches('.dropdown-avatar') && !event.target.closest('.dropdown-avatar')) avatarMenu.style.display = 'none'
})

async function checkUser() {
  const response = await fetch(`/data/user`)
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const json = await response.json()
  isUserHeader.message = json.message
  isUserHeader.uid = json.uid

  if (isUserHeader.message) {
    const updateProfileButton = document.createElement('a')
    updateProfileButton.innerText = 'Thông tin cá nhân'
    updateProfileButton.setAttribute('href', `/profile/info/${isUserHeader.uid}`)
    avatarMenu.appendChild(updateProfileButton)
  
    const logOutButton = document.createElement('a')
    logOutButton.innerText = 'Đăng Xuất'
    logOutButton.setAttribute('href', '/log-out')
    avatarMenu.appendChild(logOutButton)
  } 
  else {
    const logInButton = document.createElement('a')
    logInButton.innerText = 'Đăng nhập'
    logInButton.setAttribute('href', '/authentication/sign-in')
    avatarMenu.appendChild(logInButton)
  }
}

function updateCartCount() {
  const countObject = JSON.parse(localStorage.getItem('product_cart_count')) || {};
  const countOrdersQuantity = countObject.localCounting || 0;
  ordersQuantity.innerText = countOrdersQuantity
}

function setDisplay(width, menu) {
  if (width < 700) menu.style.display = 'none'
  else menu.style.display = 'flex'
}

checkUser()
updateCartCount()
setDisplay(width, menu)

// create input element
searchIcon.onclick = function() {
  searchInput.style.display === 'none' ? searchInput.style.display = '' : searchInput.style.display = 'none'
}

searchInput.oninput = async function(event) {
  const response = await fetch('/data/search', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query: event.target.value})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  console.log(json)
}

avatar.onclick = function() {
  avatarMenu.style.display === 'none' ? avatarMenu.style.display = '': avatarMenu.style.display = 'none'
}

responsiveMenu.onclick = function() {
  if (menu.style.display === 'none') menu.style.display = 'flex' 
  else menu.style.display = 'none'
}