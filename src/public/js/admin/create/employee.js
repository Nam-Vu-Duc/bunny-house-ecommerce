// ok
importLinkCss('/css/admin/createEmployee.css')

const submitButton = document.querySelector('button[type="submit"]')

async function createEmployee() {
  const role      = document.querySelector('select[name="role"]').value
  const storeCode = document.querySelector('select[name="storeCode"]').value
  const name      = document.querySelector('input#name').value
  const email     = document.querySelector('input#email').value
  const phone     = document.querySelector('input#phone').value
  const address   = document.querySelector('input#address').value
  const password  = document.querySelector('input#password').value

  if (
    !name     || 
    !email    || 
    !phone    || 
    !address  || 
    !password || 
    !role     || 
    !storeCode
  ) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-employees/employee/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      role      : role,
      storeCode : storeCode,
      name      : name,
      email     : email,
      phone     : phone,
      address   : address,
      password  : password,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 2000)
}

submitButton.onclick = function() {
  createEmployee()
}