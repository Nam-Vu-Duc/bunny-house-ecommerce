importLinkCss('/css/admin/detailProduct.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getProduct() {
  const response = await fetch('/admin/all-products/data/product', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {productInfo, brands, productStatuses} = await response.json()

  document.title = productInfo.name

  document.querySelector('input#id').value = productInfo._id
  document.querySelector('select#categories').querySelectorAll('option').forEach(option => {
    if (option.value === productInfo.categories) option.selected = true
  })

  if (productInfo.categories === 'skincare') {
    document.querySelector('select#skincare').style.display = 'block'
    document.querySelector('select#skincare').querySelectorAll('option').forEach(option => {
      if (option.value === productInfo.skincare) option.selected = true
    })
  } 
  
  if (productInfo.categories === 'makeup') {
    document.querySelector('select#makeup').style.display = 'block'
    document.querySelector('select#makeup').querySelectorAll('option').forEach(option => {
      if (option.value === productInfo.makeup) option.selected = true
    })
  }

  brands.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.name
    option.textContent = element.name
    if (element.name === productInfo.brand) option.selected = true
    
    document.querySelector('select#brand').appendChild(option)
  })

  document.querySelector('input#name').value          = productInfo.name
  document.querySelector('input#purchasePrice').value = formatNumber(productInfo.purchasePrice) 
  document.querySelector('input#oldPrice').value      = formatNumber(productInfo.oldPrice)
  document.querySelector('input#price').value         = formatNumber(productInfo.price)
  document.querySelector('input#description').value   = productInfo.description
  document.querySelector('input#details').value       = productInfo.details
  document.querySelector('input#quantity').value      = productInfo.quantity
  document.querySelector('input#rate').value          = productInfo.rate + '/5'
  document.querySelector('input#saleNumber').value    = productInfo.saleNumber
  document.querySelector('input#rateNumber').value    = productInfo.rateNumber

  productStatuses.forEach((element, index) => {
    const option = document.createElement('option')
    option.value = element.code
    option.textContent = element.name
    if (element.code === productInfo.status) option.selected = true
    
    document.querySelector('select#status').appendChild(option)
  })

  return
}

async function updateProduct() {

}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getProduct()
  
  document.querySelector('select#categories').addEventListener('change', (event) => {
    const selectedValue = event.target.value
    if (selectedValue === 'skincare') {
      skincare.style.display = 'block'
      makeup.style.display = 'none'
    }
  
    if (selectedValue === 'makeup') {
      skincare.style.display = 'none'
      makeup.style.display = 'block'
    }
  })
  
  formatInputNumber(document.querySelector('input#purchasePrice'))
  
  formatInputNumber(document.querySelector('input#oldPrice'))
  
  formatInputNumber(document.querySelector('input#price'))
})