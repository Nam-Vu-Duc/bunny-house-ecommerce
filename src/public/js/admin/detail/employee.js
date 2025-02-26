importLinkCss('/css/admin/detailEmployee.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getEmployee() {
  const response = await fetch('/admin/all-employees/data/employee', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {employeeInfo, storesInfo, positionsInfo} = await response.json()

  document.title = employeeInfo.name

  document.querySelector('input#id').value       = employeeInfo._id
  document.querySelector('input#name').value     = employeeInfo.name

  positionsInfo.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    if (element.code === employeeInfo.role) option.selected = true

    document.querySelector('select#role').appendChild(option)
  })

  document.querySelector('input#email').value    = employeeInfo.email
  document.querySelector('input#phone').value    = employeeInfo.phone
  document.querySelector('input#address').value  = employeeInfo.address
  document.querySelectorAll('input[name="gender"]').forEach((input) => {
    if (input.value === employeeInfo.gender) input.checked = true
  })

  storesInfo.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    if (element.code === employeeInfo.storeCode) option.selected = true
    
    document.querySelector('select#store').appendChild(option)
  })

  document.querySelector('input#date').value = formatDate(employeeInfo.createdAt)

  return
}

async function updateEmployee() {

}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getEmployee()
})