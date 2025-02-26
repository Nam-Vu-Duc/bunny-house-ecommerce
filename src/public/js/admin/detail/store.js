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
  document.querySelector('input#total').value   = storeInfo.revenue

  employeesInfo.forEach((employee) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${employee._id}</td>
      <td>${employee.name}</td>
      <td>${employee.role}</td>
      <td><a href="/admin/all-employees/employee/${employee._id}">Xem</a></td>
    `
    document.querySelector('table#table-2').querySelector('tbody').appendChild(tr)
  })

  return
}

async function updateStore() {

}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getStore()
})