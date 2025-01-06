var totalPrice = document.querySelector('td#total-price')
var totalOrderPrice = document.querySelector('td#total-order-price')

totalPrice.innerText = totalPrice.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
totalOrderPrice.innerText = totalOrderPrice.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'