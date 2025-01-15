importLinkCss('/css/admin/detailProduct.css')

pushNotification(successful)

var selectedValue     = 'skincare'
var categories        = document.querySelector('select#categories')
var skincare          = document.querySelector('select#skincare')
var makeup            = document.querySelector('select#makeup')
var skincareOptions   = document.querySelector('select#skincare').querySelectorAll('option')
var makeUpOptions     = document.querySelector('select#makeup').querySelectorAll('option')
var categoriesOptions = document.querySelector('select#categories').querySelectorAll('option')
var statusOptions     = document.querySelector('select#status').querySelectorAll('option')
var newArrivalOptions = document.querySelector('select#newArrival').querySelectorAll('option')


categoriesOptions.forEach(option => {
  if (option.value === productCategories) option.selected = true
})

statusOptions.forEach(option => {
  if (option.value === productStatus) option.selected = true
})

newArrivalOptions.forEach(option => {
  if (option.value === productNewArrival) option.selected = true
})

if (productCategories === 'skincare') {
  skincare.style.display = 'block'
  skincareOptions.forEach(option => {
    if (option.value === productSkincare) option.selected = true
  })
} 

if (productCategories === 'makeup') {
  makeup.style.display = 'block'
  makeUpOptions.forEach(option => {
    if (option.value === productMakeup) option.selected = true
  })
}

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