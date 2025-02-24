importLinkCss('/css/admin/createCustomer.css')

const submitButton = document.querySelector('button[type="submit"]')

async function createCustomer() {
  const name     = document.querySelector('input#name').value
  const email    = document.querySelector('input#email').value
  const phone    = document.querySelector('input#phone').value
  const address  = document.querySelector('input#address').value
  const password = document.querySelector('input#password').value

  if (!name || !email || !phone || !address || !password) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-customers/customer/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name    : name,
      email   : email,
      phone   : phone,
      address : address,
      password: password,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 3000)
}

submitButton.onclick = function() {
  createCustomer()
}