importLinkCss('/css/empty/signIn.css')

validator({
  form: '#form-3',
  errorSelector: '.form-message',
  rules: [
    isEmail('#email'),
    isRequiredString('#password'),
  ]
}, 2)