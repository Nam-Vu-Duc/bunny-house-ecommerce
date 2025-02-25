importLinkCss('/css/admin/detailSupplier.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getSupplier() {
  const response = await fetch('/admin/all-suppliers/data/supplier', {
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

async function updateSupplier() {

}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getSupplier()
})