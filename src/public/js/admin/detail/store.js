const revenue = document.querySelector('td.revenue')
revenue.innerText = revenue.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'