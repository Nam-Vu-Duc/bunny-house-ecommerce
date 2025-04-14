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
const img             = document.querySelector('input#img')
const imgPath         = {path: ''}

async function checkUser() {
  const response = await fetch('/data/user')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const {message, uid, data} = await response.json()
  isUserOrder.message = message
  isUserOrder.uid = uid

  if (isUserOrder.message) {
    document.querySelector('input#name').value = data.name
    document.querySelector('input#phone').value = data.phone
    document.querySelector('input#address').value = data.address
  }
}

async function updateTableBody() {
  const getProductInfo  = JSON.parse(localStorage.getItem('product_cart_count')) || {}
  const productIds      = getProductInfo.productInfo.map(product => product.id)
  const tableBody       = document.querySelector('tbody')
  totalOrderPrice.total = 0

  const response = await fetch('/data/order-products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({productIds: productIds})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const {data} = await response.json()

  data.forEach((product, index) => {
    const newProductRow = document.createElement('tr')

    const newProductImage = document.createElement('td')
    const productImage = document.createElement('img')
    productImage.setAttribute('src', `${product.img.path}`)
    newProductImage.appendChild(productImage)

    const newProductName = document.createElement('td')
    const newProductAnchorTag = document.createElement('a')
    newProductAnchorTag.setAttribute('href', `/all-products/product/${product._id}`)
    newProductAnchorTag.innerText = product.name
    newProductAnchorTag.style.paddingLeft = '5px'
    newProductName.appendChild(newProductAnchorTag)

    // create product price element
    const newProductPrice = document.createElement('td')
    newProductPrice.innerText = formatNumber(product.price)

    // create product quantity element
    const newProductQuantity   = document.createElement('td')
    const newProductTotalPrice = document.createElement('td')
    getProductInfo.productInfo.forEach((localProduct, index) => {
      if (localProduct.id === product._id) {
        const quantity = parseInt(localProduct.quantity)
        newProductQuantity.innerText   = quantity        
        newProductTotalPrice.innerText = formatNumber(quantity * product.price)
        if (product.status !== 'out-of-order') totalOrderPrice.total += product.price * quantity
      } 
    })

    const newProductDelete = document.createElement('td')
    newProductDelete.setAttribute('class', 'delete-button')
    newProductDelete.innerHTML = `
      <i class="fi fi-tr-trash-slash"></i>
    `

    newProductDelete.onclick = function() {
      getProductInfo.localCounting--
      getProductInfo.productInfo.forEach((localProduct, index) => {
        if (localProduct.id === product._id) getProductInfo.productInfo.splice(index, 1)
      })
      localStorage.setItem('product_cart_count', JSON.stringify(getProductInfo))
      document.dispatchEvent(new CustomEvent('cartUpdated'))
      deleteCartItem(tableBody)
      updateTableBody()
      preCheckAllProducts()
    }    

    // add each element to the row
    newProductRow.appendChild(document.createElement('td'))
    newProductRow.appendChild(newProductImage)
    newProductRow.appendChild(newProductName)
    newProductRow.appendChild(newProductPrice)
    newProductRow.appendChild(newProductQuantity)
    newProductRow.appendChild(newProductTotalPrice)
    newProductRow.appendChild(newProductDelete)

    if (product.status === 'out-of-order') {
      newProductRow.querySelector('td:first-child').classList.add('unavailable')
      newProductRow.querySelector('td:first-child').textContent = 'Ui hết hàng rùiii'
    }

    tableBody.appendChild(newProductRow)
  })

  updateTableFooter()
}

function preCheckAllProducts() {
  const getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {}
  if (getProductInfo.localCounting === 0) {
    nextButton.style.display = 'none'
    const emptyCartNotice = document.createElement('td')
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

function updateTableFooter() {
  const totalOrderPriceElement = document.querySelector('tfoot').querySelector('td.total')
  totalOrderPriceElement.textContent = formatNumber(totalOrderPrice.total)
}

function deleteCartItem(tableElement) {
  while (tableElement.lastChild) {
    tableElement.removeChild(tableElement.lastChild)
  }
}

async function checkOutOfOrderProduct() {
  const response = await fetch('/data/out-of-order-products')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)

  const {data} = await response.json()
  const outOfOrderProductIds = data.map(data => data._id)
  
  const getProductInfo = JSON.parse(localStorage.getItem('product_cart_count')) || {}
  getProductInfo.productInfo.forEach((productInfo, index) => {
    if (outOfOrderProductIds.includes(productInfo.id)) {
      productInfo.status = false
    }
  })
}

function submitOrder() {
  document.querySelector('button.submit-button').onclick = async function() {
    const preloader = document.querySelector('div.preloader')
    try {
      preloader.classList.remove('inactive')

      const getProductInfo  = JSON.parse(localStorage.getItem('product_cart_count')) || {}
      if (!getProductInfo.productInfo) throw Error('Giỏ hàng của bạn đang trống')  
  
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value
      const name          = document.querySelector('input[name="name"]').value
      const phone         = document.querySelector('input[name="phone"]').value
      const address       = document.querySelector('input[name="address"]').value
      const note          = document.querySelector('input[name="note"]').value
      if (
        !name     || 
        !phone    || 
        !address 
      ) throw Error('Hãy điền đầy đủ thông tin cá nhân nha')  
  
      if (!paymentMethod) throw Error('Hãy chọn phương thức thanh toán nha')
      if (paymentMethod === 'transfer' & !imgPath.path) throw Error('Hãy up bill chuyển khoản lên nha')
  
      const response = await fetch('/all-orders/create-orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          productInfo   : getProductInfo.productInfo,
          paymentMethod : paymentMethod,
          userId        : isUserOrder.uid || 'guest',
          name          : name,
          phone         : phone,
          address       : address,
          note          : note,
          img           : imgPath.path,
        })
      })
      if (!response.ok) throw new Error(`Response status: ${response.status}`)
      const {message, id} = await response.json()
      if (!message) throw Error('Có lỗi xảy ra, hãy thử lại sau')
  
      socket.emit('order')
      const orderSuccessfullyMessage = document.createElement('div')
      orderSuccessfullyMessage.setAttribute('class', 'order-successfully-message')
      orderSuccessfullyMessage.innerHTML = `
        <i class="fi fi-ss-check-circle"></i>
        <h3>Chúc mừng bạn đã đặt hàng thành công !!!</h3>
        <h3>Mã đơn hàng của bạn là: ${id}</h3>
        <h5>Nếu là người mới, bạn hãy lưu lại mã này để theo dõi đơn hàng ở mục 'Đơn hàng' nhé</h5>
        <h5>Còn nếu bạn đã có tài khoản rồi thì có thể theo dõi đơn hàng ở mục 'Thông tin cá nhân' luôn nha</h5>
        <a href="/all-orders/order/${id}"><button>OK</button></a>
      `
      document.body.appendChild(orderSuccessfullyMessage)
      preloader.classList.add('inactive')
      return
    }
    catch (error) {
      preloader.classList.add('inactive')
      console.log(error)
      return pushNotification(error)
    }
  }
}

img.addEventListener('change', function () {
  const file = img.files[0]; // Get the selected file
  const reader = new FileReader()
  reader.onload = function () {
    imgPath.path = reader.result; // Base64-encoded string
  }
  reader.readAsDataURL(file)
})

preCheckAllProducts()

checkOutOfOrderProduct()

checkUser()

window.addEventListener('DOMContentLoaded', async function loadData() {
  updateTableBody()

  displayProcess()

  submitOrder()
})