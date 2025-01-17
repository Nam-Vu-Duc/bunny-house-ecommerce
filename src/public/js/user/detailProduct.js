importLinkCss('/css/user/detailProduct.css')

var getAddToCart        = document.querySelector('div.add-to-cart')
var getBuyNow           = document.querySelector('div.buy-now')
var getOutOfOrder       = document.querySelector('div.out-of-order')
var addToCartText       = getAddToCart.querySelector('p')
var getQuantityDiv      = document.querySelector('div.quantity')
var getIncreaseQuantity = document.querySelector('i.fi-rr-add')
var getDecreaseQuantity = document.querySelector('i.fi-rr-minus-circle')
var getQuantityValue    = document.querySelector('div.quantity').querySelector('p')
var metaContent         = productDetails.slice(0, 150) + '...'
var metaDescription     = document.querySelector("meta[name='description']")

document.addEventListener("DOMContentLoaded", function() {metaDescription.setAttribute("content", metaContent);})

// set default quantity value to 0 on first load and hidden the quantity div
getQuantityValue.innerText = 0
getQuantityDiv.style.visibility = 'hidden'

// display out-of-order if true
if (productStatus === 'out-of-order') {
  getAddToCart.style.display = 'none'
  getBuyNow.style.display = 'none'
  getOutOfOrder.style.display = 'flex'
}

// get obj from storage first, if not created, return {}
var myObjFromStorage = JSON.parse(localStorage.getItem('product_cart_count')) || {
  localCounting: 0,
  productInfo: []
}

var myObj = {
  localCounting: myObjFromStorage.localCounting || 0,
  productInfo: myObjFromStorage.productInfo || []
} 

// set value to the myObj, stringify because localStorage only store string type
localStorage.setItem('product_cart_count', JSON.stringify(myObj))

// check if the item has already been added, return the button type to added
var listProductLength = typeof myObj.productInfo === 'undefined' ? 0 : myObj.productInfo.length
for (let i = 0; i < listProductLength; ++i) {
  if (myObj.productInfo[i].id === productId) {
    // change button color to 'added button'
    getAddToCart.style.backgroundColor = '#D1A6A6'
    addToCartText.style.color = 'white'

    // visible the quantity div
    getQuantityDiv.style.visibility = 'visible'
    getQuantityValue.innerText = myObj.productInfo[i].quantity 
    break
  } 
}

// increase quantity onclick
getIncreaseQuantity.onclick = function () {
  // increase the quantity on page
  getQuantityValue.innerText++
  listProductLength = myObj.productInfo.length
  for (let i = 0; i < listProductLength; ++i) {
    if (myObj.productInfo[i].id === productId) {
      // store the quantity on page to localStorage
      myObj.productInfo[i].quantity = getQuantityValue.innerText
      localStorage.setItem('product_cart_count', JSON.stringify(myObj));
    }
  }
}

// decrease quantity onclick and min = 1
getDecreaseQuantity.onclick = function () {
  for (let i = 0; i < listProductLength; ++i) {
    if (myObj.productInfo[i].id === productId) {
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

// change addToCart button behavior and increase or decrease the quantity onclick
getAddToCart.onclick = function () {
  // the item has not yet been added, click to add
  if (getAddToCart.style.backgroundColor === '') {
    // change button color to 'added button'
    getAddToCart.style.backgroundColor = '#D1A6A6'
    addToCartText.style.color = 'white'

    // add 1 to the cartCounting and set the quantity value min = 1
    myObj.localCounting++
    getQuantityValue.innerText = 1
    getQuantityDiv.style.visibility = 'visible'
    
    // create new added product 
    var newProductInfo = {
      id      : productId,
      name    : productName,
      price   : productPrice,
      image   : productImage,
      quantity: getQuantityValue.innerText
    };

    // store new added product to localStorage
    myObj.productInfo.push(newProductInfo)
  } else {
    // the item has already been added, click to remove
    // change button color to 'default button'
    getAddToCart.style.backgroundColor = ''
    addToCartText.style.color = '#D1A6A6'

    // minus 1 from the cartCounting and reset the productQuantity to 0
    myObj.localCounting--
    getQuantityValue.innerText = 0
    getQuantityDiv.style.visibility = 'hidden'

    // remove the product from the localStorage
    listProductLength = myObj.productInfo.length
    for (let i = 0; i < listProductLength; i++) {
      if (myObj.productInfo[i].id === productId) {
        myObj.productInfo.splice(i, 1)
        break
      }
    }
  }

  localStorage.setItem('product_cart_count', JSON.stringify(myObj));
  document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// add immediately item to cart and redirect to the orders page
getBuyNow.onclick = function () {
  if (getAddToCart.style.backgroundColor === '') {
    myObj.localCounting++
    getQuantityValue.innerText = 1
    getQuantityDiv.style.visibility = 'visible'

    var newProductInfo = {
      id      : productId,
      name    : productName,
      price   : productPrice,
      image   : productImage,
      quantity: getQuantityValue.innerText
    };

    myObj.productInfo.push(newProductInfo)
    localStorage.setItem('product_cart_count', JSON.stringify(myObj));
  } else {}
}