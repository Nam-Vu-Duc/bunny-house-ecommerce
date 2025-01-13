validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isRequiredString('#description'),
    isRequiredString('#details'),
  ]
}, 3)

importLinkCss('/css/admin/createBrand.css')