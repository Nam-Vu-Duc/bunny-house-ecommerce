validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isEmail('#email'),
    isRequiredString('#phone'),
    isRequiredString('#address'),
    isRequiredString('#password'),
    isConfirmPassword('#password-confirm', function() {
      return document.querySelector('#form-1 #password').value
    })
  ]
}, 6)

importLinkCss('/css/admin/createCustomer.css')