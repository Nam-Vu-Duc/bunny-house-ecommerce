// ok
importLinkCss('/css/user/detailProduct.css')

const getAddToCart        = document.querySelector('div.add-to-cart')
const getBuyNow           = document.querySelector('div.buy-now')
const getOutOfOrder       = document.querySelector('div.out-of-order')
const getQuantityDiv      = document.querySelector('div.quantity')
const getIncreaseQuantity = document.querySelector('i.fi-rr-add')
const getDecreaseQuantity = document.querySelector('i.fi-rr-minus-circle')
const getQuantityValue    = document.querySelector('div.quantity').querySelector('p')
const metaDescription     = document.querySelector("meta[name='description']")
const productElement      = document.querySelector('div.table')
const commentElement      = document.querySelector('div.comment-box')
const relatedProducts     = document.querySelector('div.related-products').querySelectorAll('div.product')
const urlSlug             = location.href.match(/([^\/]*)\/*$/)[1]
const productInfo         = {}

// get obj from storage first, if not created, return {}
const myObjFromStorage = JSON.parse(localStorage.getItem('product_cart_count')) || {
  localCounting: 0,
  productInfo: []
}
const myObj = {
  localCounting: myObjFromStorage.localCounting || 0,
  productInfo: myObjFromStorage.productInfo || []
} 
const listProductLength = {length: myObj.productInfo.length}

// set value to the myObj, stringify because localStorage only store string type
localStorage.setItem('product_cart_count', JSON.stringify(myObj))

// set default quantity value to 0 on first load and hidden the quantity div
getQuantityValue.innerText = 0
getQuantityDiv.style.visibility = 'hidden'

async function getProduct() {
  const response = await fetch('/all-products/data/product', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({productId: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data

  metaDescription.setAttribute("content", data.description)
  document.title = data.name

  productElement.querySelector('img').setAttribute('src', data.img.path)
  productElement.querySelector('img').setAttribute('alt', data.name)
  productElement.querySelector('span#rate-score').textContent = formatRate(data.rate) 
  productElement.querySelector('h3#brand').textContent = data.brand
  productElement.querySelector('h1#name').textContent = data.name
  productElement.querySelector('h4#old-price').textContent = formatNumber(data.oldPrice) 
  productElement.querySelector('h3#price').textContent = formatNumber(data.price)
  productElement.querySelector('h4#quantity').textContent = 'Số lượng: ' + data.quantity
  productElement.querySelector('h5#sale-number').textContent = 'Đã bán: ' + data.saleNumber
  productElement.querySelector('p#description').textContent = data.description
  productElement.querySelector('div.loading').remove()

  document.querySelector('p#details').textContent = data.details
  document.querySelector('p#guide').textContent = data.guide
  document.querySelector('div.rating-score').querySelector('h1').textContent = formatRate(data.rate)
  document.querySelectorAll('div.more-details').forEach(div => div.querySelector('div.loading').remove())

  return data
}

async function getComment() {
  const response = await fetch('/all-products/data/comment', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({productId: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const comments = json.data

  commentElement.querySelectorAll('div.comment').forEach((comment, index) => {
    if (index < comments.length) {
      comment.querySelector('p#sender').textContent = comments[index].senderId
      comment.querySelector('p#rate').textContent = comments[index].rate 
      comment.querySelector('p#comment').textContent = comments[index].comment 
    } else {
      comment.remove()
    }
  })

  rateProduct()
}

async function getRelatedProducts(productInfo) {
  const response = await fetch('/all-products/data/related-products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      productId: productInfo._id, 
      categories: productInfo.categories, 
      type: productInfo.skincare || productInfo.makeup})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data

  window.setTimeout(function() {
    relatedProducts.forEach((product, index) => {
      if (index < data.length) {
        product.querySelector('img').setAttribute('src', data[index].img.path)
        product.querySelector('img').setAttribute('alt', data[index].img.name)
        product.querySelector('p#old-price').textContent = formatNumber(data[index].oldPrice) 
        product.querySelector('p#price').textContent = formatNumber(data[index].price) 
        product.querySelector('p#name').textContent = data[index].name
        product.querySelector('span#rate-score').textContent = data[index].rateNumber
        product.querySelector('p#sale-number').textContent =  'Đã bán: ' + data[index].saleNumber
        product.querySelector('div.loading').style.display = 'none'
        product.querySelectorAll('i').forEach((star, i) => {
          if (i + 1 <= Math.floor(parseInt(product.querySelector('span#rate-score').innerText))) star.style.color = 'orange'
        })
        product.style.display = ''
        product.parentElement.setAttribute('href', '/all-products/product/' + data[index]._id)
      } else {
        product.remove()
      }
    })
  }, 2000)
}

function increaseQuantity(productInfo) {
  getIncreaseQuantity.onclick = function () {
    // increase the quantity on page
    getQuantityValue.innerText++
    listProductLength.length = myObj.productInfo.length
    for (let i = 0; i < listProductLength.length; ++i) {
      if (myObj.productInfo[i].id === productInfo._id) {
        // store the quantity on page to localStorage
        myObj.productInfo[i].quantity = getQuantityValue.innerText
        localStorage.setItem('product_cart_count', JSON.stringify(myObj));
      }
    }
  }
}

function decreaseQuantity(productInfo) {
  getDecreaseQuantity.onclick = function () {
    for (let i = 0; i < listProductLength.length; ++i) {
      if (myObj.productInfo[i].id === productInfo._id) {
        if (getQuantityValue.innerText === '1') {
          getQuantityValue.innerText = 1
          myObj.productInfo[i].quantity = 1
        } else {
          getQuantityValue.innerText--
          myObj.productInfo[i].quantity = getQuantityValue.innerText
        }
        localStorage.setItem('product_cart_count', JSON.stringify(myObj));
      }
    }
  }
}

function addToCart(productInfo) {
  getAddToCart.onclick = function () {
    // the item has not yet been added, click to add
    if (getAddToCart.style.backgroundColor === '') {
      // change button color to 'added button'
      getAddToCart.style.backgroundColor = '#D1A6A6'
      getAddToCart.querySelector('p').style.color = 'white'
  
      // add 1 to the cartCounting and set the quantity value min = 1
      myObj.localCounting++
      getQuantityValue.innerText = 1
      getQuantityDiv.style.visibility = 'visible'
      
      // create new added product 
      const newProductInfo = {
        id      : productInfo._id,
        name    : productInfo.name,
        price   : productInfo.price,
        image   : productInfo.img.path,
        quantity: getQuantityValue.innerText
      };
  
      // store new added product to localStorage
      myObj.productInfo.push(newProductInfo)
    } else {
      // the item has already been added, click to remove
      // change button color to 'default button'
      getAddToCart.style.backgroundColor = ''
      getAddToCart.querySelector('p').style.color = '#D1A6A6'
  
      // minus 1 from the cartCounting and reset the productQuantity to 0
      myObj.localCounting--
      getQuantityValue.innerText = 0
      getQuantityDiv.style.visibility = 'hidden'
  
      // remove the product from the localStorage
      listProductLength.length = myObj.productInfo.length
      for (let i = 0; i < listProductLength.length; i++) {
        if (myObj.productInfo[i].id === productInfo._id) {
          myObj.productInfo.splice(i, 1)
          break
        }
      }
    }
  
    localStorage.setItem('product_cart_count', JSON.stringify(myObj));
    document.dispatchEvent(new CustomEvent('cartUpdated'));
  }
}

function buyNow(productInfo) {
  getBuyNow.onclick = function () {
    if (getAddToCart.style.backgroundColor === '') {
      myObj.localCounting++
      getQuantityValue.innerText = 1
      getQuantityDiv.style.visibility = 'visible'
  
      const newProductInfo = {
        id      : productInfo._id,
        name    : productInfo.name,
        price   : productInfo.price,
        image   : productInfo.img.path,
        quantity: getQuantityValue.innerText
      };
  
      myObj.productInfo.push(newProductInfo)
      localStorage.setItem('product_cart_count', JSON.stringify(myObj));
    } else {}
  }
}

function checkExistedProduct(productInfo) {
  for (let i = 0; i < listProductLength.length; ++i) {
    if (myObj.productInfo[i].id === productInfo._id) {
      // change button color to 'added button'
      getAddToCart.style.backgroundColor = '#D1A6A6'
      getAddToCart.querySelector('p').style.color = 'white'
  
      // visible the quantity div
      getQuantityDiv.style.visibility = 'visible'
      getQuantityValue.innerText = myObj.productInfo[i].quantity 
      break
    } 
  }
}

function checkStatusProduct(productInfo) {
  if (productInfo.status === 'out-of-order') {
    getAddToCart.style.display = 'none'
    getBuyNow.style.display = 'none'
    getOutOfOrder.style.display = 'flex'
  }
}

function rateProduct() {
  const scoreList = Array.from(document.querySelectorAll('div.comment'))
  const ratingPercents = Array.from(document.querySelector('div.rating-detail-score').querySelectorAll('span#rating-percent'))
  const ratingBars = document.querySelector('div.rating-detail-score').querySelectorAll('span#rating-progress')
  const ratingNums = Array.from(document.querySelector('div.rating-detail-score').querySelectorAll('span#rating-num'))
  const rateList = Array(5).fill(0)
  scoreList.forEach((score, index) => {
    const value = parseFloat(score.querySelector('p#rate').innerText)
    scoreList[index] = value
    rateList.forEach((rate, index) => {
      if (index+1 === value) rateList[index] = rate + 1
    })
  })
  
  ratingPercents.forEach((rate, index) => {
    const length = scoreList.length || 1
    const value = (rateList[index] / length * 100).toFixed(0)
    rate.innerText = value
    ratingNums[index].innerText = rateList[index]
    ratingBars[index].style.width = `${value}%`
    ratingBars[index].style.backgroundColor = '#D1A6A6'
  })
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  const data = await getProduct()
  for (let key in data) {
    productInfo[key] = data[key]
  }
  checkExistedProduct(productInfo)
  checkStatusProduct(productInfo)
  addToCart(productInfo)
  buyNow(productInfo)
  increaseQuantity(productInfo)
  decreaseQuantity(productInfo)
  getComment()
  getRelatedProducts(productInfo)
})