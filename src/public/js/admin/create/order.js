const input                 = document.querySelector('input[type="text"][id="product-search"]')
const tbody                 = document.querySelector('tbody')
const tfoot                 = document.querySelector('tfoot')
const product               = Array.from(document.querySelectorAll('div.product')) 
const productId             = Array.from(document.querySelectorAll('p#product-id')).map((item) => item.innerText)
const productPrice          = Array.from(document.querySelectorAll('p#product-price'))
const productName           = Array.from(document.querySelectorAll('p#product-name')).map((item) => item.innerText)
const productNameNormalize  = Array.from(document.querySelectorAll('p#product-name')).map((item) => item.innerText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase())

importLinkCss('/css/admin/createOrder.css')

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function deFormatNumber(number) {
  return parseInt(number.replace(/\./g, ''))
}

const totalOrderPrice = document.createElement('input')
totalOrderPrice.setAttribute('type', 'hidden')
totalOrderPrice.setAttribute('name', 'totalOrderPrice')
totalOrderPrice.setAttribute('id', 'totalOrderPrice')
tfoot.appendChild(totalOrderPrice)

productPrice.forEach((item, index) => {
  item.innerText = formatNumber(item.innerText)
})

input.addEventListener('input', function() {
  const value = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase() 
  productNameNormalize.forEach((item, index) => {
    if (value === '') {
      product[index].style.display = 'none'
      return
    } 
    if (item.includes(value)) {
      product[index].style.display = ''
      return
    }
    product[index].style.display = 'none'
  })
})

product.forEach((item,index) => {
  item.onclick = function() {
    const newRow = document.createElement('tr')

    const name  = productName[index]
    const price = deFormatNumber(productPrice[index].innerText)
    const img   = productPrice[index]

    const prdStt = document.createElement('td')

    const prdId = document.createElement('input')
    prdId.setAttribute('type', 'hidden')
    prdId.setAttribute('name', 'productId[]')
    prdId.setAttribute('id', 'productId')
    prdId.setAttribute('value', productId[index])

    const prdName = document.createElement('td')
    const valueName = document.createElement('input')
    valueName.setAttribute('type', 'hidden')
    valueName.setAttribute('name', 'productName[]')
    valueName.setAttribute('id', 'productName')
    valueName.setAttribute('value', name)
    prdName.append(valueName)
    prdName.append(name)

    const prdPrice = document.createElement('td')
    const valuePrice = document.createElement('input')
    valuePrice.setAttribute('type', 'hidden')
    valuePrice.setAttribute('name', 'productPrice[]')
    valuePrice.setAttribute('id', 'productPrice')
    valuePrice.setAttribute('value', price)
    prdPrice.append(valuePrice)
    prdPrice.append(formatNumber(price))
    prdPrice.style.textAlign = 'right'

    const prdQty = document.createElement('td')
    const valueQty = document.createElement('input')
    valueQty.setAttribute('type', 'number')
    valueQty.setAttribute('name', 'productQuantity[]')
    valueQty.setAttribute('id', 'productQuantity')
    valueQty.setAttribute('min', 1)
    valueQty.style.width = '40px'
    valueQty.style.textAlign = 'center' 
    valueQty.value = 1
    prdQty.append(valueQty)

    const prdTotalPrice = document.createElement('td')
    prdTotalPrice.append(formatNumber(price))
    prdTotalPrice.style.textAlign = 'right'

    const prdDelete = document.createElement('td')
    prdDelete.append('x')

    newRow.appendChild(prdStt)
    newRow.appendChild(prdId)
    newRow.appendChild(prdName)
    newRow.appendChild(prdPrice)
    newRow.appendChild(prdQty)
    newRow.appendChild(prdTotalPrice)
    newRow.appendChild(prdDelete)

    tbody.appendChild(newRow)

    item.style.display = 'none'
    updatePurchaseTotalPrice()
    productAdded = tbody.querySelectorAll('tr')
    updateProductTotalPrice()
  }
})

updateProductTotalPrice = function() {
  productAdded.forEach((item, index) => {
    const input = item.querySelector('input#productQuantity')
    const remove = item.querySelector('td:last-child')
  
    input.addEventListener('input', function() {
      const price = deFormatNumber(item.querySelector('td:nth-child(4)').innerText)
      const qty = input.value
      item.querySelector('td:nth-child(6)').innerText = formatNumber(price * qty)
      updatePurchaseTotalPrice()
    })
    remove.addEventListener('click', function() {
      item.remove()
      updatePurchaseTotalPrice()
    })
  })
}

updatePurchaseTotalPrice = function() {
  var total = 0
  Array.from(document.querySelectorAll('tbody td:nth-child(6)')).forEach((item) => {
    total += deFormatNumber(item.innerText)
  })
  document.querySelector('tfoot td:nth-child(5)').innerText = formatNumber(total)
  totalOrderPrice.setAttribute('value', total)
}