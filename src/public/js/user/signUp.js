var wrongInfo = document.querySelector('p.wrong-info')
if (error) {
  wrongInfo.innerText = error
  wrongInfo.style.color = 'red'
}

validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isEmail('#email'),
    isRequiredString('#password'),
    isConfirmPassword('#password-confirm', function() {
      return document.querySelector('#form-1 #password').value
    })
  ]
}, 4)