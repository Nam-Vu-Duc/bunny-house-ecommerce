var allProductOldPrices = document.querySelectorAll('p#product-old-price')
var allProductPrices    = document.querySelectorAll('p#product-price')

allProductOldPrices.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
allProductPrices.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})