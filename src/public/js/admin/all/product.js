// display delete confirmation box
var courseId;
var deleteForm   = document.forms['delete-form']
var deleteButton = document.getElementById('delete-button')
var formButton   = document.getElementsByClassName('form-button')
var productPrice = document.querySelectorAll('td#product-price')

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

// pagination 
var pagination = document.querySelector('span.pagination')
var totalPage = 1

// display all pages tag
for (var i = 0; i < productLength; i += 10) {
  var newPage = document.createElement('a')
  newPage.setAttribute('href', `/admin/all-products?page=${totalPage}&type=${productType}`)
  newPage.innerText = `${totalPage}`
  pagination.appendChild(newPage)
  totalPage++
}

// Style the current selected page
var allPagesTag = pagination.querySelectorAll('a')
for (var i = 0; i < allPagesTag.length; ++i) {
  if (allPagesTag[i].innerText === currentPage) {
    allPagesTag[i].style.borderColor = '#D1A6A6'
    allPagesTag[i].style.backgroundColor = '#D1A6A6'
    allPagesTag[i].style.color = 'white'
    allPagesTag[i].style.width = '25px'
    allPagesTag[i].style.height = '25px'
  }
}

// filter button logic
var selectButton = document.querySelector('select')
selectButton.onchange = function () {
  location = `/admin/all-products?page=1&type=${this.value}`
}

var selectButtonOptions = selectButton.querySelectorAll('option')
selectButtonOptions.forEach(option => {
  if (option.value === productType) {
    option.setAttribute('selected', 'selected')
  }
})