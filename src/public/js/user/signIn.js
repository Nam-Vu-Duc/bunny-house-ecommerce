var wrongInfo = document.querySelector('p.wrong-info')
if (error) {
  wrongInfo.innerText = error
  wrongInfo.style.color = 'red'
}

validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isEmail('#email'),
    isRequiredString('#password'),
  ]
}, 2)

importLinkCss('/css/user/signIn.css')