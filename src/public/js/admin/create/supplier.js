importLinkCss('/css/admin/createSupplier.css')

const submitButton = document.querySelector('button[type="submit"]')

async function createSupplier() {
  const name     = document.querySelector('input#name').value
  const email    = document.querySelector('input#email').value
  const phone    = document.querySelector('input#phone').value
  const address  = document.querySelector('input#address').value

  if (!name || !email || !phone || !address) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-suppliers/supplier/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name    : name,
      email   : email,
      phone   : phone,
      address : address,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 3000)
}

submitButton.onclick = function() {
  createSupplier()
}