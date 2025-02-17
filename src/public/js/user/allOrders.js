// display each process logic
var getContactInfo   = document.querySelector('div.contact-info')
var getPaymentMethod = document.querySelector('div.payment-method')
var getNextButton    = document.querySelector('button.next-button')
var getSubmitButton  = document.querySelector('button.submit-button')
var getTableBody     = document.querySelector('tbody')
var getTableFooter   = document.querySelector('tfoot')
var orderForm        = document.querySelector('form#form-4')

// define a total order price, store as an object to change initial value through each function
var totalOrderPrice = {
  total: 0
}

// create table body
function updateTableBody(totalOrderPrice) {
  var getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {};
  var productInfoLength = getProductInfo.productInfo.length 
  var getTableBody = document.querySelector('tbody')
  totalOrderPrice.total = 0

  var newProductUserId = document.createElement('input')
  newProductUserId.setAttribute('name', 'userId')
  newProductUserId.style.display = 'none'

  // var userId = `{{userId}}`
  if (userId) newProductUserId.setAttribute('value', userId)
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

    // create new element and get data from localStorage
    var newProductName = document.createElement('td')

    // create a tag. Link to the product details page when user want to change the cart
    var newProductAnchorTag = document.createElement('a')
    newProductAnchorTag.setAttribute('href', `/all-products/product/${getProductInfo.productInfo[i].id}`)
    newProductAnchorTag.innerText = getProductInfo.productInfo[i].name
    newProductAnchorTag.style.paddingLeft = '5px'
    newProductName.appendChild(newProductAnchorTag)

    // create an input store the name value to submit the form
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
    getTableBody.appendChild(newProductRow)
    getTableBody.appendChild(newProductUserId)
  }
  deleteCart(totalOrderPrice)
}
updateTableBody(totalOrderPrice)

function preCheckAllProducts() {
  var allCurrentProducts = getTableBody.querySelectorAll('tr').length
  if (allCurrentProducts === 0) {
    getNextButton.style.display = 'none'
    var emptyCartNotice = document.createElement('td')
    emptyCartNotice.setAttribute('colspan', '6')
    emptyCartNotice.style.color = 'red'
    emptyCartNotice.style.fontWeight = 'bolder'
    emptyCartNotice.innerText = 'Giỏ hàng của bạn đang trống'
    getTableBody.appendChild(emptyCartNotice)
  }
}
preCheckAllProducts()

// display each process for customer
function displayProcess() {
    // set default display to 'none' on start
    getContactInfo.style.display = 'none'
    getPaymentMethod.style.display = 'none'
    getSubmitButton.style.display = 'none'

    getNextButton.onclick = function() {
      if (getContactInfo.style.display === 'none') {
        getContactInfo.style.display = 'grid'
      } else {
        getPaymentMethod.style.display = 'block'
      }

      if (getPaymentMethod.style.display === 'block') {
        getNextButton.style.display = 'none'
        getSubmitButton.style.display = 'block'
      }
    }
  }
displayProcess()

// create table footer
function updateTableFooter(totalOrderPrice) {
  var getTableFooter = document.querySelector('tfoot')
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
  getTableFooter.appendChild(totalOrderTitle)
  getTableFooter.appendChild(totalOrderPricesInput)
  getTableFooter.appendChild(totalOrderPrices)
  getTableFooter.appendChild(document.createElement('td'))
}
updateTableFooter(totalOrderPrice)

// delete all previous elements
function deleteCartItem(tableElement) {
  while (tableElement.lastChild) {
    tableElement.removeChild(tableElement.lastChild)
  }
}

// delete item from cart 
function deleteCart(totalOrderPrice) {
  var deleteButton = document.querySelectorAll('td.delete-button')

  for (let i = 0; i < deleteButton.length; ++i) {
    deleteButton[i].onclick = function() {
      var getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {};
      getProductInfo.localCounting--
      getProductInfo.productInfo.splice(i,1)
      localStorage.setItem('product_cart_count', JSON.stringify(getProductInfo));
      document.dispatchEvent(new CustomEvent('cartUpdated'));
      deleteCartItem(getTableBody)
      updateTableBody(totalOrderPrice)
      deleteCartItem(getTableFooter)
      updateTableFooter(totalOrderPrice)
      preCheckAllProducts()
    }
  }
}
deleteCart(totalOrderPrice)

validator({
  form: '#form-4',
  errorSelector: '.form-message',
  rules: [
    isRequiredString('#name'),
    isRequiredString('#phone'),
    isRequiredString('#address'),
  ]
}, 3)

// create successfully message
if (successful && newOrderId) {
  socket.emit('order')
  var orderSuccessfullyMessage = document.createElement('div')
  orderSuccessfullyMessage.setAttribute('class', 'order-successfully-message')
  orderSuccessfullyMessage.innerHTML = `
    <i class="fi fi-ss-check-circle"></i>
    <h3>Chúc mừng bạn đã đặt hàng thành công !!!</h3>
    <h3>Mã đơn hàng của bạn là: ${newOrderId}</h3>
    <h5>Nếu là người mới, bạn hãy lưu lại mã này để theo dõi đơn hàng ở mục 'Đơn hàng' nhé</h5>
    <h5>Còn nếu bạn đã có tài khoản rồi thì có thể theo dõi đơn hàng ở mục 'Thông tin cá nhân' luôn nha</h5>
    <a href="/"><button>OK</button></a>
  `
  document.body.appendChild(orderSuccessfullyMessage)
}

// function reply_click() {
//   orderForm.onsubmit = function(e) {
//     e.preventDefault()
//   }
//   document.getElementById('id01').style.display='block'
// }