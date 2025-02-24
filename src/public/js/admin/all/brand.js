importLinkCss('/css/admin/allBrands.css')

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = {}
const currentPage   = { page: 1 }
const dataSize      = { size: 0 }

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

  const response = await fetch('/admin/all-brands/data/brands', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  dataSize.size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Thương hiệu: ' + dataSize.size

  window.setTimeout(function() {
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      tr.remove()
    })

    data.forEach((item, index) => {
      const newTr = document.createElement('tr')
      newTr.innerHTML = `
        <td></td>
        <td class="loading" style="display:none"></td>
        <td style="display: flex; justify-content: start;align-items: center;gap: 5px">
          <img src="${item.img.path}" alt="${item.name}" loading="lazy" loading="lazy"> 
          <p>${item.name}</p>
        </td> 
        <td>${item.totalProduct}</td>
        <td>${item.totalProduct}</td>
        <td>${formatNumber(item.totalRevenue)}</td>
        <td><a href="/admin/all-brands/brand/${item._id}">Xem</a></td>
      `
      tbody.appendChild(newTr)
    })
  }, 1000)
  
  pagination(getCustomers, sortOptions, filterOptions, currentPage, dataSize.size)
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  // getFilter()
  getCustomers(sortOptions, filterOptions, currentPage.page)
  sortAndFilter(getCustomers, sortOptions, filterOptions, currentPage.page)
  exportJs()
})