// ok
importLinkCss('/css/admin/createStore.css')

const submitButton = document.querySelector('button[type="submit"]')

async function createStore() {
  const name     = document.querySelector('input#name').value
  const address  = document.querySelector('input#address').value
  const details  = document.querySelector('input#details').value

  if (!name || !address || !details) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-stores/store/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name    : name,
      address : address,
      details : details,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 2000)
}

submitButton.onclick = function() {
  createStore()
}