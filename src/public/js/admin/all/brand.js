const totalRevenue = document.querySelectorAll('td.total-revenue')
totalRevenue.forEach(price => {price.innerText = price.innerText.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})