importLinkCss('/css/admin/allProducts.css')

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = { deletedAt: null }
const currentPage   = { page: 1 }
const dataSize      = { size: 0 }
const deleteForm    = document.forms['delete-form']
const deleteButton  = document.getElementById('delete-button')
const formButton    = document.getElementsByClassName('form-button')
var courseId

async function getFilter() {
  const response = await fetch('/admin/all-products/data/filter', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const brand = json.brand

  brand.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.name
    option.textContent = element.name
    document.querySelector('select#brand').appendChild(option)
  })
}

async function getProducts(sortOptions, filterOptions, currentPage) {
  tbody.querySelectorAll('tr').forEach((tr, index) => {
    tr.querySelector('td.loading').style.display = ''
  })

  const response = await fetch('/admin/all-products/data/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  dataSize.size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Sản phẩm: ' + dataSize.size

  window.setTimeout(function() {
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      tr.remove()
    })

    data.forEach((item, index) => {
      const newTr = document.createElement('tr')
      newTr.innerHTML = `
        <td></td>
        <td class="loading" style="display:none"></td>
        <td>${item.brand}</td>
        <td style="
          display: flex; 
          justify-content: start;
          align-items: center;
          "
        >
          <img src="${item.img.path}" alt="${item.name}" loading="lazy" loading="lazy"> 
          <p>${item.name}</p>
        </td>  
        <td>${formatNumber(item.purchasePrice)}</td>
        <td>${formatNumber(item.price)}</td>
        <td>${item.quantity}</td>
        <td>
          <a href="/admin/all-products/product/${item._id}" class="update-button">Xem</a>
          <button id="${item._id}" name="${item.name}" onclick="reply_click(this.id, this.name)">Xoá</button> 
        </td>
      `
      tbody.appendChild(newTr)
    })
  }, 1000)

  pagination(getProducts, sortOptions, filterOptions, currentPage, dataSize.size)
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
  sortAndFilter(getProducts, sortOptions, filterOptions, currentPage.page)
  getProducts(sortOptions, filterOptions, currentPage.page)
  exportJs()
})