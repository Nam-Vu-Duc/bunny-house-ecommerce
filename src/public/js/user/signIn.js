// ok
importLinkCss('/css/empty/signIn.css')

async function checkingAccount() {
  const email = document.querySelector('input#email').value
  const password = document.querySelector('input#password').value
  const response = await fetch("/authentication/checking-account", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const isValid = json.isValid
  const message = json.message
  
  if (!isValid) {
    document.querySelector('p.wrong-info').textContent = message
    document.querySelector('p.wrong-info').style.color = 'red'
    return 
  } 
  document.querySelector('p.wrong-info').textContent = ''
  pushNotification(message)

  setTimeout(() => {
    window.location.replace("http://localhost:3000/home")
  }, 1000)
  
  return
}

validator({
  form: '#form-1',
  errorSelector: '.form-message',
  rules: [
    isEmail('#email'),
    isRequiredString('#password'),
  ]
}, 2)

document.querySelector("form").addEventListener("submit", function(event) {
  event.preventDefault() // Prevents form submission
  checkingAccount()
})