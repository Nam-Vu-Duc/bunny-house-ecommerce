var totalRevenue       = document.querySelectorAll('td#total-revenue')
var productPrice       = document.querySelectorAll('td#product-price')

totalRevenue.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
productPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})