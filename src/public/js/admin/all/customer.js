importLinkCss('/css/admin/allCustomers.css')

const tbody         = document.querySelector('table').querySelector('tbody')
const sortOptions   = {}
const filterOptions = {}
const currentPage   = { page: 1 }

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
    // tr.remove()
  })

  const response = await fetch('/admin/all-customers/data/customers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({sort: sortOptions, filter: filterOptions, page: currentPage})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  const data_size = json.data_size

  document.querySelector('div.board-title').querySelector('p').textContent = 'Khách Hàng: ' + data_size

  window.setTimeout(function() {
    tbody.querySelectorAll('tr').forEach((tr, index) => {
      tr.remove()
      if (index < data_size) {
        const newTr = document.createElement('tr')
        newTr.innerHTML = `
          <td></td>
          <td>${data[index]._id}</td>
          <td>${data[index].name}</td>
          <td>${data[index].address}</td>
          <td>${data[index].quantity}</td>
          <td>${formatNumber(data[index].revenue)}</td>
          <td><a href="/admin/all-customers/customer/${data[index]._id}">Xem</a></td>
        `
        
        tbody.appendChild(newTr)
      }
    })
  }, 1000)
  
  return data_size
}

// function sortAndFilter() {
//   const sortButton = document.querySelector('div.sort').querySelectorAll('select')
//   sortButton.forEach((button) => {
//     button.onchange = function () {
//       const sortType = button.id
//       const sortValue = parseInt(button.value)
//       sortOptions[sortType] = sortValue
//       if (!sortValue) delete sortOptions[sortType]
//       console.log(sortOptions)
//       getCustomers(sortOptions, filterOptions, currentPage.page)
//     }
    
//     const options = button.querySelectorAll('option')
//     options.forEach((option) => {
//       const sortType = 'sort_' + button.id
//       const urlParams = new URLSearchParams(window.location.search)
//       if (urlParams.get(sortType)) {
//         if (option.value === urlParams.get(sortType)) {
//           option.setAttribute('selected', 'selected')
//         }
//       } 
//     })
//   }) 
  
//   const filterButton = document.querySelector('div.filter').querySelectorAll('select')
//   filterButton.forEach((button) => {
//     button.onchange = function () {
//       const filterType = 'filter_' + button.id
//       const filterValue = button.value
//       const urlParams = new URLSearchParams(window.location.search)
//       urlParams.set(filterType, filterValue)
//       window.location.search = urlParams
//     }
    
//     const options = button.querySelectorAll('option')
//     options.forEach((option) => {
//       const filterType = 'filter_' + button.id
//       const urlParams = new URLSearchParams(window.location.search)
//       if (urlParams.get(filterType)) {
//         if (option.value === urlParams.get(filterType)) {
//           option.setAttribute('selected', 'selected')
//         }
//       } 
//     })
//   }) 

//   const searchInput = document.querySelector('input#search-input')
//   searchInput.addEventListener('input', function(e) {
//     const value = searchInput.value.trim()
//   })

//   searchInput.addEventListener('keypress', function(e) {
//     if (e.key === "Enter" && searchInput.value.trim() !== '') {
//       const urlParams = new URLSearchParams(window.location.search)
//       const searchType = 'filter_' + searchInput.getAttribute('name')
//       urlParams.set(searchType, searchInput.value.trim())
//       window.location.search = urlParams
//     }
//   })
// }

window.addEventListener('DOMContentLoaded', async function loadData() {
  getFilter()
  getCustomers(sortOptions, filterOptions, currentPage.page)
  // pagination(totalCustomer, currentPage)
  sortAndFilter(getCustomers, sortOptions, filterOptions, currentPage.page)
  exportJs()
})