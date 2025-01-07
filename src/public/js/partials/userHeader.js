// update cart-orders base on each user using local storage
var getOrdersQuantity = document.querySelector('span.orders-quantity')
  
function updateCartCount() {
  var countObject = JSON.parse(localStorage.getItem('product_cart_count')) || {};
  var countOrdersQuantity = countObject.localCounting || 0;
  getOrdersQuantity.innerText = countOrdersQuantity
}

document.addEventListener('cartUpdated', updateCartCount);
updateCartCount()

// onclick search icon
var getSearchIcon = document.querySelector('i.fi-br-search')
var getForm = document.querySelector('form.search-form')
getForm.style.display = 'none'

// create input element
var searchInput = document.createElement('input')
searchInput.setAttribute('id', 'search-input')
searchInput.setAttribute('type', 'text')
searchInput.setAttribute('placeholder', 'nhập mã hàng, tên sản phẩm để tìm kiếm')

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
var getAvatarMenu = document.querySelector('div.avatar-menu')
var getAvatar = document.querySelector('img.dropdown-avatar')
getAvatarMenu.style.display = 'none'

getAvatar.onclick = function() {
  if (getAvatarMenu.style.display === 'none') getAvatarMenu.style.display = 'block'
  else getAvatarMenu.style.display = 'none'
}

document.addEventListener('click', function(event) {
  if (!event.target.matches('.dropdown-avatar') && !event.target.closest('.dropdown-avatar')) getAvatarMenu.style.display = 'none'
});

if (isUser === 'true') {
  var updateProfileButton = document.createElement('a')
  updateProfileButton.innerText = 'Thông tin cá nhân'
  updateProfileButton.setAttribute('href', `/profile`)
  getAvatarMenu.appendChild(updateProfileButton)

  var logOutButton = document.createElement('a')
  logOutButton.innerText = 'Đăng Xuất'
  logOutButton.setAttribute('href', '/log-out')
  getAvatarMenu.appendChild(logOutButton)
} 
else {
  var logInButton = document.createElement('a')
  logInButton.innerText = 'Đăng nhập'
  logInButton.setAttribute('href', '/authentication/sign-in')
  getAvatarMenu.appendChild(logInButton)
}

// resposive menu
var responsiveMenu = document.querySelector('div.responsive-menu')
var menu = document.querySelector('div.menu')
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