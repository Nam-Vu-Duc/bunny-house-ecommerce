importLinkCss('/css/admin/createProduct.css')

// skincare and makeup visibility
var selectBox = document.querySelector('select[name="categories"]')
var selectedValue = ''
var skincareBox = document.querySelector('select[name="skincare"]').parentElement
var makeUpBox = document.querySelector('select[name="makeup"]').parentElement

selectBox.onchange = function() {
  selectedValue = selectBox.options[selectBox.selectedIndex].value;
  if (selectedValue === 'skincare') {
    skincareBox.style.display = 'block'
    makeUpBox.style.display = 'none'
  }
  if (selectedValue === 'makeup') {
    skincareBox.style.display = 'none'
    makeUpBox.style.display = 'block'
  }
}