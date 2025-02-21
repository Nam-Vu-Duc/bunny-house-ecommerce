function sortAndFilter(getDataFunction, sortOptions, filterOptions, currentPage) {
  const sortButton = document.querySelector('div.sort').querySelectorAll('select')
  sortButton.forEach((button) => {
    button.onchange = function () {
      const sortType = button.id
      const sortValue = parseInt(button.value)
      sortOptions[sortType] = sortValue
      if (!sortValue) delete sortOptions[sortType]
      console.log(sortOptions)
      getDataFunction(sortOptions, filterOptions, currentPage)
    }
    
    const options = button.querySelectorAll('option')
    options.forEach((option) => {
      const sortType = 'sort_' + button.id
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get(sortType)) {
        if (option.value === urlParams.get(sortType)) {
          option.setAttribute('selected', 'selected')
        }
      } 
    })
  }) 
  
  const filterButton = document.querySelector('div.filter').querySelectorAll('select')
  filterButton.forEach((button) => {
    button.onchange = function () {
      const filterType = 'filter_' + button.id
      const filterValue = button.value
      const urlParams = new URLSearchParams(window.location.search)
      urlParams.set(filterType, filterValue)
      window.location.search = urlParams
    }
    
    const options = button.querySelectorAll('option')
    options.forEach((option) => {
      const filterType = 'filter_' + button.id
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get(filterType)) {
        if (option.value === urlParams.get(filterType)) {
          option.setAttribute('selected', 'selected')
        }
      } 
    })
  }) 

  const searchInput = document.querySelector('input#search-input')
  searchInput.addEventListener('input', function(e) {
    const value = searchInput.value.trim()
  })

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === "Enter" && searchInput.value.trim() !== '') {
      const urlParams = new URLSearchParams(window.location.search)
      const searchType = 'filter_' + searchInput.getAttribute('name')
      urlParams.set(searchType, searchInput.value.trim())
      window.location.search = urlParams
    }
  })
}