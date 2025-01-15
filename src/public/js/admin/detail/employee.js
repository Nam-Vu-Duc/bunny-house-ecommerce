importLinkCss('/css/admin/detailEmployee.css')

pushNotification(successful)

var male = document.querySelector('input#male')
var female = document.querySelector('input#female')
gender === 'male' ? male.checked = true : female.checked = true

var roleOptions = document.querySelector('select#role').querySelectorAll('option')
roleOptions.forEach(option => {
  if (option.value === role) option.selected = true
})

var storeOptions = document.querySelector('select#store').querySelectorAll('option')
storeOptions.forEach(option => {
  if (option.value === storeId) option.selected = true
})