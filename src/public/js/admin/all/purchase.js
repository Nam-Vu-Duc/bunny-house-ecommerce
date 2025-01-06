const totalPrice = document.querySelectorAll('td.total-price')
totalPrice.forEach(price => {price.innerText = price.innerText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})