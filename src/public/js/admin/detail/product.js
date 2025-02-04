importLinkCss('/css/admin/detailProduct.css')
pushNotification(successful)

var selectedValue     = productCategories
var categories        = document.querySelector('select#categories')
var categoriesOptions = document.querySelector('select#categories').querySelectorAll('option')
categoriesOptions.forEach(option => {
  if (option.value === productCategories) option.selected = true
})

categories.addEventListener('change', (event) => {
  selectedValue = event.target.value
  if (selectedValue === 'skincare') {
    skincare.style.display = 'block'
    makeup.style.display = 'none'
  }

  if (selectedValue === 'makeup') {
    skincare.style.display = 'none'
    makeup.style.display = 'block'
  }
})

var skincare          = document.querySelector('select#skincare')
var skincareOptions   = document.querySelector('select#skincare').querySelectorAll('option')
if (productCategories === 'skincare') {
  skincare.style.display = 'block'
  skincareOptions.forEach(option => {
    if (option.value === productSkincare) option.selected = true
  })
} 

var makeup            = document.querySelector('select#makeup')
var makeUpOptions     = document.querySelector('select#makeup').querySelectorAll('option')
if (productCategories === 'makeup') {
  makeup.style.display = 'block'
  makeUpOptions.forEach(option => {
    if (option.value === productMakeup) option.selected = true
  })
}

var brandsOptions     = document.querySelector('select#brand').querySelectorAll('option')
brandsOptions.forEach(option => {
  if (option.value === productBrand) option.selected = true
})

var statusOptions     = document.querySelector('select#status').querySelectorAll('option')
statusOptions.forEach(option => {
  if (option.value === productStatus) option.selected = true
})