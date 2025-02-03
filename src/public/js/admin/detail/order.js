importLinkCss('/css/admin/detailOrder.css')

pushNotification(successful)

var selectPaymentMethod = document.querySelector('select#paymentMethod')
var paymentMethodOptions = selectPaymentMethod.querySelectorAll('option')

var selectStatus = document.querySelector('select#status')
var selectOptions = selectStatus.querySelectorAll('option')

var submitButton = document.querySelector('button[type="submit"]')

if (orderStatus === 'done') {
  selectStatus.disabled = true
  selectStatus.style.cursor = 'not-allowed'
  submitButton.style.display = 'none'
} 

paymentMethodOptions.forEach(option => {
  if (option.value === paymentMethod) option.selected = true
})

selectOptions.forEach(option => {
  if (option.value === orderStatus) option.selected = true
})
