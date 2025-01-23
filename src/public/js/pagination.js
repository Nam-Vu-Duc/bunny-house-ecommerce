function pagination(type, length, currentPage) {
  var pagination = document.querySelector('span.pagination')
  var totalPage = 1

  // display all page tags
  for (let i = 0; i < length; i += 10) {
    var newPage = document.createElement('a')
    newPage.setAttribute('href', `/admin/all-${type}?page=${totalPage}`)
    newPage.innerText = `${totalPage}`
    pagination.appendChild(newPage)
    totalPage++
  }

  // Style the current selected page
  var allPagesTag = pagination.querySelectorAll('a')
  for (let i = 0; i < allPagesTag.length; ++i) {
    if (allPagesTag[i].innerText === currentPage) {
      allPagesTag[i].style.borderColor = '#D1A6A6'
      allPagesTag[i].style.backgroundColor = '#D1A6A6'
      allPagesTag[i].style.color = 'white'
      allPagesTag[i].style.width = '25px'
      allPagesTag[i].style.height = '25px'
    }
  } 
}

function filterButtonLogic() {
  var selectButton = document.querySelector('select')
  selectButton.onchange = function () {
    location = `/all-products/${getSlug}?page=1&column=${sortedColumn}&sort=${sort}&type=${this.value}`
  }

  var selectButtonOptions = selectButton.querySelectorAll('option')
  selectButtonOptions.forEach(option => {
    if (option.value === productType) {
      option.setAttribute('selected', 'selected')
    }
  })
}

for (var i = 0; i < productLength; i += 10) {
  var newPage = document.createElement('p')
  newPage.innerText = `${totalPage}`
  pagination.appendChild(newPage)
  totalPage++
}

// Style the current selected page
var allPagesTag = pagination.querySelectorAll('p')
allPagesTag.forEach((tag, index) => {
  if (tag.innerText === currentPage) {
    tag.style.borderColor = '#D1A6A6'
    tag.style.backgroundColor = '#D1A6A6'
    tag.style.color = 'white'
    tag.style.width = '25px'
    tag.style.height = '25px'
  }
  tag.onclick = function() {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('page', index+1)
    window.location.search = urlParams
  }
})

// sort
var selectButton = document.querySelectorAll('select')
selectButton.forEach((button) => {
  button.onchange = function () {
    const sortType = button.id
    const sortValue = button.value
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set(sortType, sortValue)
    window.location.search = urlParams
  }
  
  const options = button.querySelectorAll('option')
  options.forEach((option) => {
    const sortType = button.id
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get(sortType)) {
      if (option.value === urlParams.get(sortType)) {
        option.setAttribute('selected', 'selected')
      }
    } 
  })
}) 