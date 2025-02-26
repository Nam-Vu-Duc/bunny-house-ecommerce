importLinkCss('/css/admin/detailSupplier.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getSupplier() {
  const response = await fetch('/admin/all-suppliers/data/supplier', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {supplierInfo, purchaseInfo} = await response.json()

  document.title = supplierInfo.name

  document.querySelector('input#id').value       = supplierInfo._id
  document.querySelector('input#name').value     = supplierInfo.name
  document.querySelector('input#email').value    = supplierInfo.email
  document.querySelector('input#phone').value    = supplierInfo.phone
  document.querySelector('input#address').value  = supplierInfo.address
  document.querySelector('input#quantity').value = supplierInfo.quantity
  document.querySelector('input#total').value    = formatNumber(supplierInfo.totalCost) 
  
  purchaseInfo.forEach((purchase) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td></td>
      <td>${formatNumber(purchase.totalPurchasePrice)}</td>
      <td>${formatDate(purchase.purchaseDate)}</td>
      <td><a href="/admin/all-purchases/purchase/${purchase._id}">Xem</a></td>
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