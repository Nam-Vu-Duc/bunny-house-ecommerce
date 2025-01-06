// pagination 
var pagination = document.querySelector('span.pagination')
var totalPage = 1

// díplay all pages tag
for (let i = 0; i < productLength; i += 10) {
  var newPage = document.createElement('a')
  newPage.setAttribute('href', `/all-products/${getSlug}?page=${totalPage}&column=${sortedColumn}&sort=${sort}`)
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

// sort
let selectButton = document.querySelector('select')
selectButton.onchange = function () {
  // if (getSlug === 'skincare') {
  //   location = `/all-products/skincare/${getSlug}?page=1&column=price&sort=${this.value}`
  // } else if (getSlug === 'makeup') {
  //   location = `/all-products/makeup/${getSlug}?page=1&column=price&sort=${this.value}`    
  // } else {
  //   location = `/all-products/${getSlug}?page=1&column=price&sort=${this.value}`
  location = `/all-products/${getSlug}?page=1&column=price&sort=${this.value}`
}