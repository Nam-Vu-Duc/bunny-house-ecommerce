importLinkCss('/css/admin/detail/purchase.css')

const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getPurchase() {
  const response = await fetch('/admin/all-purchases/data/purchase', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {error, purchaseInfo, supplierInfo} = await response.json()
  if (error) return pushNotification('Có lỗi xảy ra')

  document.title = 'Đơn nhập: ' + supplierInfo.name

  document.querySelector('input#id').value       = purchaseInfo._id
  document.querySelector('input#date').value     = formatDate(purchaseInfo.purchaseDate) 
  document.querySelector('input#supplier').value = supplierInfo.name
  document.querySelector('input#phone').value    = supplierInfo.phone
  document.querySelector('input#address').value  = supplierInfo.address
  document.querySelector('input#note').value     = purchaseInfo.note
  document.querySelector('input#total').value    = formatNumber(purchaseInfo.totalPurchasePrice)

  purchaseInfo.products.forEach((product) => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td></td>
      <td style="
        display: flex; 
        justify-content: start;
        align-items: center;
        gap: 5px"
      >
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.name}
      </td>
      <td>${product.quantity}</td>
      <td>${formatNumber(product.price)}</td>
      <td><a href="/admin/all-products/product/${product.id}">Xem</a></td>
    `
    document.querySelector('table#table-2').querySelector('tbody').appendChild(tr)
  })

  return
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  try {
    getPurchase()
  } catch (error) {
    console.error('Có lỗi xảy ra:', error)
    pushNotification('Có lỗi xảy ra')
  }
})