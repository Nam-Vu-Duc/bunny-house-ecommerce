importLinkCss('/css/admin/detailOrder.css')

pushNotification(successful)

var selectStatus = document.querySelector('select#status')
var submitButton = document.querySelector('button[type="submit"]')
var options = selectStatus.querySelectorAll('option')

if (orderStatus === 'done') {
  selectStatus.disabled = true
  selectStatus.style.cursor = 'not-allowed'
  submitButton.style.display = 'none'
} 

options.forEach(option => {
  if (option.value === orderStatus) option.selected = true
})
