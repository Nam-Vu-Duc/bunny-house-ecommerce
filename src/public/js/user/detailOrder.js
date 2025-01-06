var totalOrderPrice   = document.querySelectorAll('td#total-order-price')
var productPrice      = document.querySelectorAll('td#product-price')
var totalProductPrice = document.querySelectorAll('td#total-product-price')

totalOrderPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
productPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
totalProductPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})