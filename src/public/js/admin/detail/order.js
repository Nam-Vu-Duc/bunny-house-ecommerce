importLinkCss('/css/admin/detailOrder.css')

pushNotification(successful)

var options = document.querySelector('select#status').querySelectorAll('option')
options.forEach(option => {
  if (option.value === orderStatus) option.selected = true
})