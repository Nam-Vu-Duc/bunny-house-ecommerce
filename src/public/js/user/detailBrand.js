// ok
const metaDescription     = document.querySelector("meta[name='description']")
const brandElement        = document.querySelector('div.table')
const relatedProducts     = document.querySelector('div.related-products').querySelectorAll('div.product')
const urlSlug             = location.href.match(/([^\/]*)\/*$/)[1]
const brandInfo           = {}

async function getBrand() {
  const response = await fetch('/all-brands/data/brand', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: urlSlug})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  console.log(data)

  metaDescription.setAttribute("content", data.description)
  document.title = data.name

  brandElement.querySelector('img').setAttribute('src', data.img.path)
  brandElement.querySelector('img').setAttribute('alt', data.name)
  brandElement.querySelector('h1#title').textContent = data.name
  brandElement.querySelector('p#description').textContent = data.description
  
  document.querySelector('p#details').textContent = data.description

  return data
}

async function getRelatedProducts(brandInfo) {
  const response = await fetch('/all-brands/data/related-products', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: brandInfo.name})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  console.log(data)

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

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND'
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  const data = await getBrand()
  for (let key in data) {
    brandInfo[key] = data[key]
  }
  getRelatedProducts(brandInfo)
})