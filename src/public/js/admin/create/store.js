validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isRequiredString('#address'),
    isRequiredString('#details')
  ]
}, 3)