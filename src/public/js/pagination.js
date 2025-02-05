function pagination(length, currentPage) {
  var pagination = document.querySelector('span.pagination')
  var totalPage = 1

  for (var i = 0; i < length; i += 10) {
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
}