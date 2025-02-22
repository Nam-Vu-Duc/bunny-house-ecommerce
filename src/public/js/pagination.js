function pagination(getDataFunction, sortOptions, filterOptions,currentPage, data_size) {
  document.querySelector('span.pagination').querySelectorAll('p').forEach(p => p.remove())
  var totalPage = 1
  for (var i = 0; i < data_size; i += 10) {
    const newPage = document.createElement('p')
    if (i === 0) newPage.classList.add('current')
    newPage.innerText = `${totalPage}`
    document.querySelector('span.pagination').appendChild(newPage)
    newPage.onclick = function() {
      document.querySelector('span.pagination').querySelectorAll('p').forEach(t => t.classList.remove('current'))
      currentPage = parseInt(newPage.innerText) 
      console.log(currentPage)
      newPage.classList.add('current')

      getDataFunction(sortOptions, filterOptions, currentPage)
    }
    totalPage++
  }
}