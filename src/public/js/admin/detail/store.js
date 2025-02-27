importLinkCss('/css/admin/detailStore.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getStore() {
  const response = await fetch('/admin/all-stores/data/store', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {storeInfo, employeesInfo} = await response.json()

  document.title = storeInfo.name

  document.querySelector('input#id').value      = storeInfo._id
  document.querySelector('input#name').value    = storeInfo.name
  document.querySelector('input#address').value = storeInfo.address
  document.querySelector('input#details').value = storeInfo.details
  document.querySelector('input#total').value   = formatNumber(storeInfo.revenue) 

  employeesInfo.forEach((employee) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${employee._id}</td>
      <td>${employee.name}</td>
      <td>${employee.storeName.name}</td>
      <td><a href="/admin/all-employees/employee/${employee._id}">Xem</a></td>
    `
    document.querySelector('table#table-2').querySelector('tbody').appendChild(tr)
  })

  return storeInfo
}

async function updateStore(storeInfo) {
  const name    = document.querySelector('input#name').value
  const address = document.querySelector('input#address').value
  const details = document.querySelector('input#details').value

  if (
    name    === storeInfo.name    &&
    address === storeInfo.address &&
    details === storeInfo.details   
  ) return pushNotification('Hãy cập nhật thông tin')

  const response = await fetch('/admin/all-stores/store/updated', {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      id      : urlSlug,
      name    : name,
      address : address,
      details : details,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {isValid, message} = await response.json()

  pushNotification(message)

  if (!isValid) return
  setTimeout(() => window.location.reload(), 3000)
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  const storeInfo = await getStore()

  document.querySelector('button[type="submit"]').onclick = function() {
    updateStore(storeInfo)
  }
})