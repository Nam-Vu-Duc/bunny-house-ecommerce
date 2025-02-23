importLinkCss('/css/admin/allPurchases.css')

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = {}
const currentPage   = { page: 1 }
const dataSize      = { size: 0 }

async function getFilter() {
  const response = await fetch('/admin/all-purchases/data/filter', {
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

async function getPurchases(sortOptions, filterOptions, currentPage) {
  tbody.querySelectorAll('tr').forEach((tr, index) => {
    tr.querySelector('td.loading').style.display = ''
  })

  const response = await fetch('/admin/all-purchases/data/purchases', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  dataSize.size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Đơn nhập: ' + dataSize.size

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
        <td>${formatDate(item.purchaseDate)}</td>
        <td>${item.totalProducts}</td>
        <td>${formatNumber(item.totalPurchasePrice)}</td>
        <td><a href="/admin/all-purchases/purchase/${item._id}">Xem</a></td>
      `
      tbody.appendChild(newTr)
    })
  }, 1000)
  
  pagination(getPurchases, sortOptions, filterOptions, currentPage, dataSize.size)
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  // getFilter()
  getPurchases(sortOptions, filterOptions, currentPage.page)
  sortAndFilter(getPurchases, sortOptions, filterOptions, currentPage.page)
  exportJs()
})