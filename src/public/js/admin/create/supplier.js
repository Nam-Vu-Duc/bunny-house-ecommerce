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

importLinkCss('/css/admin/createSupplier.css')