var input                 = document.querySelector('input[type="text"][id="product-search"]')
var tbody                 = document.querySelector('tbody')
var tfoot                 = document.querySelector('tfoot')
var product               = Array.from(document.querySelectorAll('div.product')) 
var productId             = Array.from(document.querySelectorAll('p#product-id')).map((item) => item.innerText)
var productPrice          = Array.from(document.querySelectorAll('p#product-price'))
var productName           = Array.from(document.querySelectorAll('p#product-name')).map((item) => item.innerText)
var productNameNormalize  = Array.from(document.querySelectorAll('p#product-name')).map((item) => item.innerText.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase())

importLinkCss('/css/admin/createPurchase.css')

formatNumber = function(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

deFormatNumber = function(number) {
  return parseInt(number.replace(/\./g, ''))
}

var totalPurchasePrice = document.createElement('input')
totalPurchasePrice.setAttribute('type', 'hidden')
totalPurchasePrice.setAttribute('name', 'totalPurchasePrice')
totalPurchasePrice.setAttribute('id', 'totalPurchasePrice')
tfoot.appendChild(totalPurchasePrice)

productPrice.forEach((item, index) => {
  item.innerText = formatNumber(item.innerText)
})

input.addEventListener('input', function() {
  var value = input.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase() 
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
    var newRow = document.createElement('tr')

    var name  = productName[index]
    var price = deFormatNumber(productPrice[index].innerText)
    var img   = productPrice[index]

    var prdStt = document.createElement('td')

    var prdId = document.createElement('input')
    prdId.setAttribute('type', 'hidden')
    prdId.setAttribute('name', 'productId[]')
    prdId.setAttribute('id', 'productId')
    prdId.setAttribute('value', productId[index])

    var prdName = document.createElement('td')
    prdName.append(name)

    var prdPrice = document.createElement('td')
    prdPrice.append(formatNumber(price))
    prdPrice.style.textAlign = 'right'

    var prdQty = document.createElement('td')
    var valueQty = document.createElement('input')
    valueQty.setAttribute('type', 'number')
    valueQty.setAttribute('name', 'productQuantity[]')
    valueQty.setAttribute('id', 'productQuantity')
    valueQty.setAttribute('min', 1)
    valueQty.style.width = '40px'
    valueQty.style.textAlign = 'center' 
    valueQty.value = 1
    prdQty.append(valueQty)

    var prdTotalPrice = document.createElement('td')
    prdTotalPrice.append(formatNumber(price))
    prdTotalPrice.style.textAlign = 'right'

    var prdDelete = document.createElement('td')
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
    var input = item.querySelector('input#productQuantity')
    var remove = item.querySelector('td:last-child')
  
    input.addEventListener('input', function() {
      var price = deFormatNumber(item.querySelector('td:nth-child(4)').innerText)
      var qty = input.value
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
  totalPurchasePrice.setAttribute('value', total)
}