importLinkCss('/css/admin/profile.css')

async function getProfile() {
  const response = await fetch('/admin/profile/data/profile', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
    const {userInfo, storesInfo, positionsInfo} = await response.json()

  document.title = userInfo.name

  document.querySelector('input#id').value   = userInfo._id
  document.querySelector('input#name').value = userInfo.name

  positionsInfo.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    if (element.code === userInfo.role) option.selected = true

    document.querySelector('select#role').appendChild(option)
  })

  document.querySelector('input#email').value    = userInfo.email
  document.querySelector('input#phone').value    = userInfo.phone
  document.querySelector('input#address').value  = userInfo.address
  document.querySelectorAll('input[name="gender"]').forEach((input) => {
    if (input.value === userInfo.gender) input.checked = true
  })

  storesInfo.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    if (element.code === userInfo.storeCode) option.selected = true
    
    document.querySelector('select#store').appendChild(option)
  })

  document.querySelector('input#date').value = formatDate(userInfo.createdAt)

  return userInfo
}

async function updateProfile(userInfo) {
  const name    = document.querySelector('input#name').value
  const phone   = document.querySelector('input#phone').value
  const address = document.querySelector('input#address').value
  const gender  = document.querySelector('input[name="gender"]:checked').value

  if (
    name    === userInfo.name    &&
    phone   === userInfo.phone   &&
    address === userInfo.address &&
    gender  === userInfo.gender
  ) return pushNotification('Hãy cập nhật thông tin')

  const response = await fetch('/admin/profile/updated', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name    : name,
      phone   : phone,
      address : address,
      gender  : gender
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {isValid, message} = await response.json()

  pushNotification(message)

  if (!isValid) return
  setTimeout(() => window.location.reload(), 3000)
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  const userInfo = await getProfile()

  document.querySelector('button[type="submit"]').onclick = function() {
    updateProfile(userInfo)
  }
})