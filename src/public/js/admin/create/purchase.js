importLinkCss('/css/admin/createPurchase.css')

const input              = document.querySelector('input[type="text"][id="product-search"]')
const tbody              = document.querySelector('tbody')
const tfoot              = document.querySelector('tfoot')
const submitButton       = document.querySelector('button[type="submit"]')
const productId          = []
const productQuantity    = []
const totalPurchasePrice = { value: 0 }

function updateProductTotalPrice() {
  tbody.querySelectorAll('tr').forEach((tr) => {
    const input  = tr.querySelector('input#productQuantity')
    const remove = tr.querySelector('td:last-child')

    input.addEventListener('input', function() {
      const price = deFormatNumber(tr.querySelector('td:nth-child(4)').innerText)
      const qty = input.value
      tr.querySelector('td:nth-child(6)').innerText = formatNumber(price * qty)
      updatePurchaseTotalPrice()
    })

    remove.addEventListener('click', function() {
      tr.remove()
      updatePurchaseTotalPrice()
    })
  })
}

function updatePurchaseTotalPrice() {
  var total = 0
  tbody.querySelectorAll('td:nth-child(6)').forEach((td) => {
    total += deFormatNumber(td.innerText)
  })
  document.querySelector('tfoot td:nth-child(5)').innerText = formatNumber(total)
  totalPurchasePrice.value = total
}

async function getSuppliers() {
  const response = await fetch('/admin/all-purchases/data/suppliers', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  data.forEach((element) => {
    const option = document.createElement('option')
    option.value = element._id
    option.textContent = element.name + ': ' + element.phone
    document.querySelector('select[name="supplierId"]').appendChild(option) 
  })

  return
}

async function getProducts(query) {
  document.querySelector('div.products-match').querySelectorAll('div').forEach(element => element.remove())

  if (query === '') return

  const response = await fetch('/admin/all-purchases/data/products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query: query })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()
  console.log(data)

  data.forEach((element) => {
    const div = document.createElement('div')
    div.classList.add('product')
    div.innerHTML = `
      <p style="display: none" id="product-id">${element._id}</p>
      <p style="width: 15%">${element.brand}</p>
      <p 
        style="width: 65%; display:flex; align-items:center; justify-content:start; gap:5px"
        id="product-name"
      >
        <img src="${element.img.path}" alt="${element.name}" loading="lazy" loading="lazy"> 
        ${element.name}
      </p>  
      <p style="width: 10%;">${element.categories}</p>
      <p style="width: 10%; text-align:right" id="product-price">${formatNumber(element.purchasePrice)}</p>
    `

    div.addEventListener('click', function() {
      productId.push(element._id)
      const newRow = document.createElement('tr')
      newRow.innerHTML = `
        <td></td>
        <td style="display: none"><input type="hidden" name="productId[]" id="productId" value="${element._id}"></td>
        <td style="display:flex; align-items:center; justify-content:start; gap:5px">
          <img src="${element.img.path}" alt="${element.name}" loading="lazy" loading="lazy"> 
          ${element.name}
        </td>
        <td style="text-align: right;">${formatNumber(element.purchasePrice)}</td>
        <td><input type="number" name="productQuantity[]" id="productQuantity" min="1" value="1" style="max-width: 50px; text-align: center;"></td>
        <td style="text-align: right;">${formatNumber(element.purchasePrice)}</td>
        <td>x</td>
      `
      tbody.appendChild(newRow)

      updateProductTotalPrice()

      updatePurchaseTotalPrice()
    })

    document.querySelector('div.products-match').appendChild(div)
  })

  return
}

async function createPurchase() {
  const purchaseDate        = document.querySelector('input#purchaseDate').value
  const supplierId          = document.querySelector('select#supplierId').value
  const note                = document.querySelector('input#note').value

  if (!purchaseDate || !supplierId || !note || !productId || !productQuantity || !totalPurchasePrice) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-customers/customer/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name    : name,
      email   : email,
      phone   : phone,
      address : address,
      password: password,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 2000)
}

input.addEventListener('input', function() {
  const value = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase() 
  getProducts(value)
})

submitButton.onclick = function() {
  createPurchase()
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getSuppliers()
})