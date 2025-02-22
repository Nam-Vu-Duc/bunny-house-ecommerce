importLinkCss('/css/admin/allProducts.css')

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = {}
const currentPage   = { page: 1 }
const dataSize      = { size: 0 }
const deleteForm    = document.forms['delete-form']
const deleteButton  = document.getElementById('delete-button')
const formButton    = document.getElementsByClassName('form-button')
var courseId

async function getFilter() {
  const response = await fetch('/admin/all-customers/data/filter', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data

  data.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    document.querySelector('select#memberCode').appendChild(option)
  })
}

async function getCustomers(sortOptions, filterOptions, currentPage) {
  tbody.querySelectorAll('tr').forEach((tr, index) => {
    tr.querySelector('td.loading').style.display = ''
  })

  const response = await fetch('/admin/all-customers/data/customers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  dataSize.size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Khách Hàng: ' + dataSize.size

  window.setTimeout(function() {
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      tr.remove()
    })

    data.forEach((item, index) => {
      const newTr = document.createElement('tr')
      newTr.innerHTML = `
        <td></td>
        <td class="loading" style="display:none"></td>
        <td>${item._id}</td>
        <td>${item.name}</td>
        <td>${item.address}</td>
        <td>${item.quantity}</td>
        <td>${formatNumber(item.revenue)}</td>
        <td><a href="/admin/all-customers/customer/${item._id}">Xem</a></td>
      `
      tbody.appendChild(newTr)
    })
  }, 1000)
  
  pagination(getCustomers, sortOptions, filterOptions, currentPage.page, dataSize.size)
}

function reply_click(clicked_id, clicked_name) {
  const name = clicked_name
  const message = document.querySelector('p#confirm-message')
  message.innerText = `Bạn có muốn xoá sản phẩm ${name} không ?`
  document.getElementById('id01').style.display='block'
  courseId = clicked_id
}

// delete action
deleteButton.onclick = function () {
  deleteForm.action = '/admin/all-products/product/soft-delete/' + courseId + '?_method=DELETE'
  deleteForm.submit()
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getFilter()
  getCustomers(sortOptions, filterOptions, currentPage.page)
  sortAndFilter(getCustomers, sortOptions, filterOptions, currentPage.page)
  exportJs()
})