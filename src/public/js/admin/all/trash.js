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


async function getDeletedProducts(sortOptions, filterOptions, currentPage) {
  tbody.querySelectorAll('tr').forEach((tr, index) => {
    tr.querySelector('td.loading').style.display = ''
  })

  const response = await fetch('/admin/all-products/data/deleted-products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  dataSize.size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Sản phẩm đã xoá: ' + dataSize.size

  window.setTimeout(function() {
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      tr.remove()
    })

    data.forEach((item, index) => {
      const newTr = document.createElement('tr')
      newTr.innerHTML = `
        <td></td>
        <td>${item.brand}</td>
        <td style="display: flex; justify-content: center;align-items: center">
          <img src="${item.img.path}" alt="${item.name}" loading="lazy">
          <p>${item.name}</p>
        </td>
        <td>${item.categories}</td>
        <td>${formatNumber(item.price)}</td>
        <td>
          <button id="${item._id}" onclick="clickToRestore(this.id)">Khôi Phục</button>
          <button id="${item._id}" onclick="clickToDelete(this.id)">Xoá</button>
        </td>
      `
      tbody.appendChild(newTr)
    })
  }, 1000)
  
  pagination(getDeletedProducts , sortOptions, filterOptions, currentPage, dataSize.size)
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
  getDeletedProducts(sortOptions, filterOptions, currentPage.page)
})