var currentTime = new Date().getHours()
var checkDay = ''
var homeButton          = document.querySelector('a#home-page')
var customersButton     = document.querySelector('a#customers')
var chatsButton         = document.querySelector('a#chats')
var purchaseButton      = document.querySelector('a#purchases')
var ordersButton        = document.querySelector('a#orders')
var storeButton         = document.querySelector('a#stores')
var employeesButton     = document.querySelector('a#employees')
var productsButton      = document.querySelector('a#products')
var brandsButton        = document.querySelector('a#brands')
var trashButton         = document.querySelector('a#trash')
var updateProfileButton = document.querySelector('a#profile')
var logOutButton        = document.querySelector('a#log-out')
const buttonMap = {
  home            : homeButton,
  customers       : customersButton,
  chats           : chatsButton,
  purchases       : purchaseButton,
  orders          : ordersButton,
  stores          : storeButton,
  employees       : employeesButton,
  products        : productsButton,
  brands          : brandsButton,
  trash           : trashButton,
  profile         : updateProfileButton,
};
if (buttonMap[index]) buttonMap[index].style.backgroundColor = '#FFDFDF';

if      (currentTime <= 9) checkDay = 'buổi sáng'
else if (currentTime <= 14) checkDay = 'buổi trưa'
else if (currentTime <= 18) checkDay = 'buổi chiều'
else    checkDay = 'buổi tối'

var helloText = `Xin chào Quỳnh Ly, Chúc bạn một ${checkDay} vui vẻ !!!`
document.getElementById('welcome-text').innerHTML = helloText