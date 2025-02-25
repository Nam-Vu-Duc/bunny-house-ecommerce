importLinkCss('/css/admin/detailProduct.css')
pushNotification(successful)

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getProduct() {
  const response = await fetch('/admin/all-products/data/product', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {customerInfo, memberInfo, orderInfo} = await response.json()
  console.log(orderInfo)

  document.title = customerInfo.name

  document.querySelector('input#id').value       = customerInfo._id
  document.querySelector('input#name').value     = customerInfo.name
  document.querySelector('input#email').value    = customerInfo.email
  document.querySelector('input#phone').value    = customerInfo.phone
  document.querySelector('input#address').value  = customerInfo.address
  document.querySelectorAll('input[name="gender"]').forEach((input) => {
    if (input.value === customerInfo.gender) input.checked = true
  })
  document.querySelector('input#quantity').value = customerInfo.quantity
  document.querySelector('input#revenue').value  = formatNumber(customerInfo.revenue)
  document.querySelector('input#member').value   = memberInfo.name
  document.querySelector('select#categories').querySelectorAll('option').forEach(option => {
    if (option.value === productCategories) option.selected = true
  })
  
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
  
  if (productCategories === 'skincare') {
    document.querySelector('select#skincare').style.display = 'block'
    document.querySelector('select#skincare').querySelectorAll('option').forEach(option => {
      if (option.value === productSkincare) option.selected = true
    })
  } 
  
  if (productCategories === 'makeup') {
    document.querySelector('select#makeup').style.display = 'block'
    document.querySelector('select#makeup').querySelectorAll('option').forEach(option => {
      if (option.value === productMakeup) option.selected = true
    })
  }
  
  document.querySelector('select#brand').querySelectorAll('option').forEach(option => {
    if (option.value === productBrand) option.selected = true
  })
  
  document.querySelector('select#status').querySelectorAll('option').forEach(option => {
    if (option.value === productStatus) option.selected = true
  })

  orderInfo.forEach((order) => {
    const tr = document.querySelector('tr')
    tr.innerHTML = `
      <td></td>
      <td>${formatNumber(order.totalOrderPrice)}</td>
      <td>${order.paymentMethod}</td>
      <td>${order.orderStatus.name}</td>
      <td><a href="/admin/all-orders/order/${order._id}">Xem</a></td>
    `
    document.querySelector('table#table-2').querySelector('tbody').appendChild(tr)
  })

  return
}

async function updateProduct() {

}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getProduct()
})