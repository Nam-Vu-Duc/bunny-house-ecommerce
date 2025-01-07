var totalRevenue = document.querySelector('td.totalRevenue')
var maxValueOrderNumber = document.querySelector('td.maxValueOrderNumber')

totalRevenue.innerText = totalRevenue.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
maxValueOrderNumber.innerText = maxValueOrderNumber.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'