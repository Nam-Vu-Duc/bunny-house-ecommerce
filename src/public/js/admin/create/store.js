validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isRequiredString('#address'),
    isRequiredString('#details')
  ]
}, 3)

importLinkCss('/css/admin/createStore.css')