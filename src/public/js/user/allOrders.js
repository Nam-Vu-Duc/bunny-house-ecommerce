// ok
importLinkCss('/css/user/allOrders.css')

const contactInfo     = document.querySelector('div.contact-info')
const paymentMethod   = document.querySelector('div.payment-method')
const nextButton      = document.querySelector('button.next-button')
const submitButton    = document.querySelector('button.submit-button')
const tableBody       = document.querySelector('tbody')
const tableFooter     = document.querySelector('tfoot')
const isUserOrder     = {message: false}
const totalOrderPrice = {total: 0}

async function checkUser() {
  const response = await fetch(`/data/user`)
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const {message, uid} = await response.json()
  isUser.message = message
  isUser.uid = uid
}

function updateTableBody(totalOrderPrice) {
  var getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {};
  var productInfoLength = getProductInfo.productInfo.length 
  var tableBody = document.querySelector('tbody')
  totalOrderPrice.total = 0

  var newProductUserId = document.createElement('input')
  newProductUserId.setAttribute('name', 'userId')
  newProductUserId.style.display = 'none'

  // var userId = `{{userId}}`
  if (isUserOrder.message) newProductUserId.setAttribute('value', isUserOrder.uid)
  else newProductUserId.setAttribute('value', 'guest')

  // create new row for new product have name, price, quantity and totalPrice
  for (let i = 0; i < productInfoLength; ++i) {
    // create new row
    var newProductRow = document.createElement('tr') 

    // create img link 
    var newProductImage = document.createElement('td')
    var productImage = document.createElement('img')
    productImage.setAttribute('src', `${getProductInfo.productInfo[i].image}`)
    newProductImage.appendChild(productImage)

    // create an input store the img value to submit the form
    var newProductImgInput = document.createElement('input')
    newProductImgInput.setAttribute('type', 'hidden')
    newProductImgInput.setAttribute('name', 'productImg')
    newProductImgInput.setAttribute('value', getProductInfo.productInfo[i].image)

    // create new element and get data from localStorage
    var newProductName = document.createElement('td')
    var newProductAnchorTag = document.createElement('a')
    newProductAnchorTag.setAttribute('href', `/all-products/product/${getProductInfo.productInfo[i].id}`)
    newProductAnchorTag.innerText = getProductInfo.productInfo[i].name
    newProductAnchorTag.style.paddingLeft = '5px'
    newProductName.appendChild(newProductAnchorTag)

    // create an input store the id value to submit the form
    var newProductIdInput = document.createElement('input')
    newProductIdInput.setAttribute('type', 'hidden')
    newProductIdInput.setAttribute('name', 'productId')
    newProductIdInput.setAttribute('value', getProductInfo.productInfo[i].id)
    
    // create an input store the name value to submit the form
    var newProductNameInput = document.createElement('input')
    newProductNameInput.setAttribute('type', 'hidden')
    newProductNameInput.setAttribute('name', 'productName')
    newProductNameInput.setAttribute('value', getProductInfo.productInfo[i].name)

    // create product price element
    var newProductPrice = document.createElement('td')
    newProductPrice.innerText = `${getProductInfo.productInfo[i].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VND`

    // create an input store the price value to submit the form
    var newProductPriceInput = document.createElement('input')
    newProductPriceInput.setAttribute('type', 'hidden')
    newProductPriceInput.setAttribute('name', 'productPrice')
    newProductPriceInput.setAttribute('value', getProductInfo.productInfo[i].price)

    // create product quantity element
    var newProductQuantity = document.createElement('td')
    newProductQuantity.innerText = getProductInfo.productInfo[i].quantity

    // create an input store the quantity value to submit the form
    var newProductQuantityInput = document.createElement('input')
    newProductQuantityInput.setAttribute('type', 'hidden')
    newProductQuantityInput.setAttribute('name', 'productQuantity')
    newProductQuantityInput.setAttribute('value', getProductInfo.productInfo[i].quantity)

    // create product total price element
    var newProductTotalPrice = document.createElement('td')
    var convertNewProductTotalPriceToString = (getProductInfo.productInfo[i].price * getProductInfo.productInfo[i].quantity).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') 
    newProductTotalPrice.innerText = `${convertNewProductTotalPriceToString} VND`
    
    // create an input store the total price value to submit the form
    var newProductTotalPriceInput = document.createElement('input')
    newProductTotalPriceInput.setAttribute('type', 'hidden')
    newProductTotalPriceInput.setAttribute('name', 'productTotalPrice')
    newProductTotalPriceInput.setAttribute('value', getProductInfo.productInfo[i].price * getProductInfo.productInfo[i].quantity)

    var newProductDelete = document.createElement('td')
    newProductDelete.setAttribute('class', 'delete-button')
    newProductDelete.innerHTML = `
      <i class="fi fi-tr-trash-slash"></i>
    `

    // calculate all product prices
    totalOrderPrice.total += (getProductInfo.productInfo[i].price) * getProductInfo.productInfo[i].quantity

    // add each element to the row
    newProductRow.appendChild(newProductImage)
    newProductRow.appendChild(newProductImgInput)

    newProductRow.appendChild(newProductIdInput)

    newProductRow.appendChild(newProductName)
    newProductRow.appendChild(newProductNameInput)

    newProductRow.appendChild(newProductPrice)
    newProductRow.appendChild(newProductPriceInput)

    newProductRow.appendChild(newProductQuantity)
    newProductRow.appendChild(newProductQuantityInput)

    newProductRow.appendChild(newProductTotalPrice)
    newProductRow.appendChild(newProductTotalPriceInput)

    newProductRow.appendChild(newProductDelete)

    // add each row to the table
    tableBody.appendChild(newProductRow)
    tableBody.appendChild(newProductUserId)
  }
  deleteCart(totalOrderPrice)
}

function preCheckAllProducts() {
  var allCurrentProducts = tableBody.querySelectorAll('tr').length
  if (allCurrentProducts === 0) {
    nextButton.style.display = 'none'
    var emptyCartNotice = document.createElement('td')
    emptyCartNotice.setAttribute('colspan', '6')
    emptyCartNotice.style.color = 'red'
    emptyCartNotice.style.fontWeight = 'bolder'
    emptyCartNotice.innerText = 'Giỏ hàng của bạn đang trống'
    tableBody.appendChild(emptyCartNotice)
  }
}

function displayProcess() {
  // set default display to 'none' on start
  contactInfo.style.display = 'none'
  paymentMethod.style.display = 'none'
  submitButton.style.display = 'none'

  nextButton.onclick = function() {
    if (contactInfo.style.display === 'none') {
      contactInfo.style.display = 'grid'
    } else {
      paymentMethod.style.display = 'block'
    }

    if (paymentMethod.style.display === 'block') {
      nextButton.style.display = 'none'
      submitButton.style.display = 'block'
    }
  }
}

function updateTableFooter(totalOrderPrice) {
  var tableFooter = document.querySelector('tfoot')
  var totalOrderTitle = document.createElement('td')
  totalOrderTitle.setAttribute('colspan', '4')
  totalOrderTitle.innerText = 'Tổng'

  var totalOrderPrices = document.createElement('td')
  var totalOrderPricesInput = document.createElement('input')
  totalOrderPricesInput.setAttribute('type', 'hidden')
  totalOrderPricesInput.setAttribute('name', 'totalOrderPrice')
  totalOrderPricesInput.setAttribute('value', totalOrderPrice.total)
  var convertTotalOrderPricesToString = totalOrderPrice.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') 
  totalOrderPrices.innerText = `${convertTotalOrderPricesToString} VND`

  // add each element to the total order row
  tableFooter.appendChild(totalOrderTitle)
  tableFooter.appendChild(totalOrderPricesInput)
  tableFooter.appendChild(totalOrderPrices)
  tableFooter.appendChild(document.createElement('td'))
}

function deleteCartItem(tableElement) {
  while (tableElement.lastChild) {
    tableElement.removeChild(tableElement.lastChild)
  }
}

function deleteCart(totalOrderPrice) {
  var deleteButton = document.querySelectorAll('td.delete-button')

  for (let i = 0; i < deleteButton.length; ++i) {
    deleteButton[i].onclick = function() {
      var getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {};
      getProductInfo.localCounting--
      getProductInfo.productInfo.splice(i,1)
      localStorage.setItem('product_cart_count', JSON.stringify(getProductInfo));
      document.dispatchEvent(new CustomEvent('cartUpdated'));
      deleteCartItem(tableBody)
      updateTableBody(totalOrderPrice)
      deleteCartItem(tableFooter)
      updateTableFooter(totalOrderPrice)
      preCheckAllProducts()
    }
  }
}

function submitOrder() {
  document.querySelector('button.submit-button').onclick = async function() {
    const productId         = []
    const productImg        = []
    const productName       = []
    const productPrice      = []
    const productQuantity   = []
    const productTotalPrice = []
    const totalOrderPrice   = document.querySelector('input[name="totalOrderPrice"]').value
    const paymentMethod     = document.querySelector('input[name="paymentMethod"]:checked')?.value
    const userId            = document.querySelector('input[name="userId"]').value
    const name              = document.querySelector('input[name="name"]').value
    const phone             = document.querySelector('input[name="phone"]').value
    const address           = document.querySelector('input[name="address"]').value
    const note              = document.querySelector('input[name="note"]').value
    document.querySelectorAll('input[name="productId"]').forEach((input) => {
      productId.push(input.value)
    })
    document.querySelectorAll('input[name="productImg"]').forEach((input) => {
      productImg.push(input.value)
    })
    document.querySelectorAll('input[name="productName"]').forEach((input) => {
      productName.push(input.value)
    })
    document.querySelectorAll('input[name="productPrice"]').forEach((input) => {
      productPrice.push(input.value)
    })
    document.querySelectorAll('input[name="productQuantity"]').forEach((input) => {
      productQuantity.push(input.value)
    })
    document.querySelectorAll('input[name="productTotalPrice"]').forEach((input) => {
      productTotalPrice.push(input.value)
    })

    const response = await fetch('/all-orders/create-orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        productId         : productId,
        productImg        : productImg,
        productName       : productName,
        productPrice      : productPrice,
        productQuantity   : productQuantity,
        productTotalPrice : productTotalPrice,
        totalOrderPrice   : totalOrderPrice,
        paymentMethod     : paymentMethod,
        userId            : userId,
        name              : name,
        phone             : phone,
        address           : address,
        note              : note
      })
    })
    if (!response.ok) throw new Error(`Response status: ${response.status}`)
    const json = await response.json()
    const message = json.message
    const id = json.id
    if (!message) {
      return
    }

    socket.emit('order')
    const orderSuccessfullyMessage = document.createElement('div')
    orderSuccessfullyMessage.setAttribute('class', 'order-successfully-message')
    orderSuccessfullyMessage.innerHTML = `
      <i class="fi fi-ss-check-circle"></i>
      <h3>Chúc mừng bạn đã đặt hàng thành công !!!</h3>
      <h3>Mã đơn hàng của bạn là: ${id}</h3>
      <h5>Nếu là người mới, bạn hãy lưu lại mã này để theo dõi đơn hàng ở mục 'Đơn hàng' nhé</h5>
      <h5>Còn nếu bạn đã có tài khoản rồi thì có thể theo dõi đơn hàng ở mục 'Thông tin cá nhân' luôn nha</h5>
      <a href="/"><button>OK</button></a>
    `
    document.body.appendChild(orderSuccessfullyMessage)
  }
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  checkUser()

  updateTableBody(totalOrderPrice)

  updateTableFooter(totalOrderPrice)

  preCheckAllProducts()

  displayProcess()

  deleteCart(totalOrderPrice)

  submitOrder()
})