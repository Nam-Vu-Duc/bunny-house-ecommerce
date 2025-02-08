pagination(totalProduct, currentPage)
importLinkCss('/css/admin/allProducts.css')
pushNotification(successful)
sortAndFilter()
exportJs()

// display delete confirmation box
var courseId;
var deleteForm   = document.forms['delete-form']
var deleteButton = document.getElementById('delete-button')
var formButton   = document.getElementsByClassName('form-button')

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