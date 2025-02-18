const header = document.querySelector('header')
window.addEventListener('scroll', function() {
  document.documentElement.scrollTop > 0 ? header.classList.add('scroll') : header.classList.remove('scroll')
})

const isUserHeader = {message: false}

async function checkUser() {
  const response = await fetch(`/data/user`)
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const json = await response.json()
  isUserHeader.message = json.message
  isUserHeader.uid = json.uid

  if (isUserHeader.message) {
    const updateProfileButton = document.createElement('a')
    updateProfileButton.innerText = 'Thông tin cá nhân'
    updateProfileButton.setAttribute('href', `/profile/info`)
    getAvatarMenu.appendChild(updateProfileButton)
  
    const logOutButton = document.createElement('a')
    logOutButton.innerText = 'Đăng Xuất'
    logOutButton.setAttribute('href', '/log-out')
    getAvatarMenu.appendChild(logOutButton)
  } 
  else {
    const logInButton = document.createElement('a')
    logInButton.innerText = 'Đăng nhập'
    logInButton.setAttribute('href', '/authentication/sign-in')
    getAvatarMenu.appendChild(logInButton)
  }
}

checkUser()

// update cart-orders base on each user using local storage
const getOrdersQuantity = document.querySelector('span.orders-quantity')
function updateCartCount() {
  const countObject = JSON.parse(localStorage.getItem('product_cart_count')) || {};
  const countOrdersQuantity = countObject.localCounting || 0;
  getOrdersQuantity.innerText = countOrdersQuantity
}

document.addEventListener('cartUpdated', updateCartCount);
updateCartCount()

// onclick search icon
const getSearchIcon = document.querySelector('i.fi-br-search')
const getForm = document.querySelector('form.search-form')
getForm.style.display = 'none'

// create input element
const searchInput = document.createElement('input')
searchInput.setAttribute('id', 'search-input')
searchInput.setAttribute('name', 'q')
searchInput.setAttribute('type', 'text')
searchInput.setAttribute('placeholder', 'Nhập mã hàng, tên sản phẩm để tìm kiếm')

getSearchIcon.onclick = function() {
  if (getForm.style.display === 'none') {
    getForm.style.display = 'block'
    getForm.appendChild(searchInput)
  } 
  else {
    getForm.style.display = 'none'
    getForm.removeChild(searchInput)
  }
}

// onclick avatar
const getAvatarMenu = document.querySelector('div.avatar-menu')
const getAvatar = document.querySelector('img.dropdown-avatar')
getAvatarMenu.style.display = 'none'

getAvatar.onclick = function() {
  if (getAvatarMenu.style.display === 'none') getAvatarMenu.style.display = 'block'
  else getAvatarMenu.style.display = 'none'
}

document.addEventListener('click', function(event) {
  if (!event.target.matches('.dropdown-avatar') && !event.target.closest('.dropdown-avatar')) getAvatarMenu.style.display = 'none'
})

// resposive menu
const responsiveMenu = document.querySelector('div.responsive-menu')
const menu = document.querySelector('div.menu')
var width = window.innerWidth

function setDisplay(width, menu) {
  if (width < 700) menu.style.display = 'none'
  else menu.style.display = 'flex'
}
setDisplay(width, menu)

window.addEventListener("resize", function() {
  width = window.innerWidth
  setDisplay(width, menu)
});

responsiveMenu.onclick = function() {
  if (menu.style.display === 'none') menu.style.display = 'flex' 
  else menu.style.display = 'none'
}