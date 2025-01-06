const revenue = document.querySelectorAll('td.revenue')
revenue.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})