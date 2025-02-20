// ok
importLinkCss('/css/user/detailOrder.css')
const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

async function getOrder() {
  const response = await fetch('/all-orders/data/order', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  const status = json.status

  document.querySelector('td#id').textContent = data._id || ''
  document.querySelector('td#date').textContent = formatDate(data.createdAt) || ''
  document.querySelector('td#name').textContent = data.customerInfo.name || ''
  document.querySelector('td#phone').textContent = data.customerInfo.phone || ''
  document.querySelector('td#address').textContent = data.customerInfo.address || ''
  document.querySelector('td#note').textContent = data.customerInfo.note || ''
  document.querySelector('td#total-price').textContent = formatNumber(data.totalOrderPrice) || ''
  document.querySelector('td#status').textContent = status.name || ''

  data.products.forEach((product) => {
    const tr = document.createElement('tr')

    const nameGroup = document.createElement('td')
    const img = document.createElement('img')
    img.setAttribute('src', product.image || '')

    const name = document.createElement('a')
    name.setAttribute('href', '/all-products/product/' + product.id)
    name.textContent = product.name || ''
    nameGroup.appendChild(img)
    nameGroup.appendChild(name)
    nameGroup.classList.add('name-group')

    const price = document.createElement('td')
    price.textContent = formatNumber(product.price || '') 

    const quantity = document.createElement('td')
    quantity.textContent = product.quantity || ''

    const totalPrice = document.createElement('td')
    totalPrice.textContent = formatNumber(product.totalPrice || '') 

    tr.appendChild(nameGroup)
    tr.appendChild(price)
    tr.appendChild(quantity)
    tr.appendChild(totalPrice)

    document.querySelector('table.all-products').querySelector('tbody').appendChild(tr)
  })

  return
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getOrder()
})