var selectedValue           = 'skincare'
// var skincareBox             = document.querySelector('select[name="skincare"]').parentElement
// var makeUpBox               = document.querySelector('select[name="makeup"]').parentElement
// var categoriesSelectOptions = document.querySelector('select[name="categories"]').querySelectorAll('option')
// var statusSelectOptions     = document.querySelector('select[name="status"]').querySelectorAll('option')
// var newArrivalSelectOptions = document.querySelector('select[name="newArrival"]').querySelectorAll('option')
var productType             = ''
var oldPrice                = document.querySelector('td#old-price')
var newPrice                = document.querySelector('td#new-price')

oldPrice.innerText = oldPrice.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
newPrice.innerText = newPrice.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
// selected product category
categoriesSelectOptions.forEach(option => {
  if (option.value === productCategories) {
    option.setAttribute('selected', 'selected')
  }
})

// selected product status
statusSelectOptions.forEach(option => {
  if (option.value === productStatus) {
    option.setAttribute('selected', 'selected')
  }
})

// selected product newArrival
newArrivalSelectOptions.forEach(option => {
  if (option.value === productNewArrival) {
    option.setAttribute('selected', 'selected')
  }
})

// display product category
if (productCategories === 'skincare') {
  skincareBox.style.display = 'block'
  makeUpBox.style.display = 'none'
  productType = 'skincare'
}

if (productCategories === 'makeup') {
  skincareBox.style.display = 'none'
  makeUpBox.style.display = 'block'
  productType = 'makeup'
}

// selected product type
if (productType === 'skincare') {
  var skincareSelectOptions = document.querySelector('select[name="skincare"]').querySelectorAll('option')
  skincareSelectOptions.forEach(option => {
    if (option.value === productSkincare) {
      option.setAttribute('selected', 'selected')
    }
  })
}

if (productType === 'makeup') {
  var makeupSelectOptions = document.querySelector('select[name="makeup"]').querySelectorAll('option')
  makeupSelectOptions.forEach(option => {
    if (option.value === productMakeup) {
      option.setAttribute('selected', 'selected')
    }
  })
}