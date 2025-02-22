importLinkCss('/css/admin/trash.css') 

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = {}
const currentPage   = { page: 1 }
const dataSize      = { size: 0 }
const deleteForm    = document.forms['delete-form']
const restoreForm   = document.forms['restore-form']
const deleteButton  = document.getElementById('delete-button')
const restoreButton = document.getElementById('restore-button')
var productId;


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

function clickToDelete(clicked_id) {
  document.getElementById('id01').style.display='block'
  productId = clicked_id
}

deleteButton.onclick = function () {
  deleteForm.action = '/admin/all-products/product/delete/' + productId + '?_method=DELETE'
  deleteForm.submit()
}

//restore button
function clickToRestore(clicked_id) {
  document.getElementById('id00').style.display='block'
  productId = clicked_id
}

restoreButton.onclick = function () {
  restoreForm.action = '/admin/all-products/product/restore/' + productId 
  restoreForm.submit()
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getCustomers(sortOptions, filterOptions, currentPage.page)
  sortAndFilter(getCustomers, sortOptions, filterOptions, currentPage.page)
  exportJs()
})