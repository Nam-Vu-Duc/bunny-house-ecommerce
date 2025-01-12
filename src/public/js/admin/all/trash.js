// delete button
var productId;
var deleteForm    = document.forms['delete-form']
var restoreForm   = document.forms['restore-form']
var deleteButton  = document.getElementById('delete-button')
var restoreButton = document.getElementById('restore-button')

function clickToDelete(clicked_id) {
  document.getElementById('id01').style.display='block'
  productId = clicked_id
}

deleteButton.onclick = function () {
  deleteForm.action = '/admin/all-products/product/delete/' + productId + '?_method=DELETE'
  deleteForm.submit()
}

//restore button
function clickToRestore(clicked_id) {
  document.getElementById('id00').style.display='block'
  productId = clicked_id
}

restoreButton.onclick = function () {
  restoreForm.action = '/admin/all-products/product/restore/' + productId 
  restoreForm.submit()
}
