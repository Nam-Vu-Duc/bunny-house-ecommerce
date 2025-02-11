validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isEmail('#email'),
    isRequiredString('#phone'),
    isRequiredString('#address')
  ]
})

pushNotification(successful)
importLinkCss('/css/admin/createSupplier.css')