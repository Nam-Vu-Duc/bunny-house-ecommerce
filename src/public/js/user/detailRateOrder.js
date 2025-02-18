import { format } from 'https://cdn.jsdelivr.net/npm/date-fns@latest/+esm';
const submitBtn = document.querySelector("button[type='submit']")
const rateDiv = document.querySelectorAll('div.rate-star')
const urlSlug = location.href.match(/([^\/]*)\/*$/)[1]

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND'
}

function formatDate(date) {
  return format(new Date(date), 'dd/MM/yyyy')
}

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

  document.querySelector('td#id').textContent = data._id
  document.querySelector('td#date').textContent = formatDate(data.createdAt)
  document.querySelector('td#name').textContent = data.customerInfo.name
  document.querySelector('td#phone').textContent = data.customerInfo.phone
  document.querySelector('td#address').textContent = data.customerInfo.address
  document.querySelector('td#note').textContent = data.customerInfo.note
  document.querySelector('td#total-price').textContent = formatNumber(data.totalOrderPrice) 
  document.querySelector('td#status').textContent = status.name

  data.products.forEach((product) => {
    const tr = document.createElement('tr')

    const nameGroup = document.createElement('td')
    const img = document.createElement('img')
    img.setAttribute('src', product.image)

    const name = document.createElement('a')
    name.setAttribute('href', '/all-products/product/' + product.id)
    name.textContent = product.name
    nameGroup.appendChild(img)
    nameGroup.appendChild(name)
    nameGroup.classList.add('name-group')

    const price = document.createElement('td')
    price.textContent = formatNumber(product.price) 

    const quantity = document.createElement('td')
    quantity.textContent = product.quantity

    const totalPrice = document.createElement('td')
    totalPrice.textContent = formatNumber(product.totalPrice) 

    tr.appendChild(nameGroup)
    tr.appendChild(price)
    tr.appendChild(quantity)
    tr.appendChild(totalPrice)

    const tr2 = document.createElement('tr')
    const td = document.createElement('td')
    td.setAttribute('colspan', 4)

    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('placeholder', 'Nhập đánh giá của bạn')
    input.setAttribute('type', 'text')

    document.querySelector('table.all-products').querySelector('tbody').appendChild(tr)
  })

  return
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  getOrder()
})

if (isRated === 'true') {
  submitBtn.innerText = 'Đã đánh giá'
  submitBtn.style.cursor = 'not-allowed'
  submitBtn.style.opacity = '0.8'
}

rateDiv.forEach((div) => {
  const stars = div.querySelectorAll('i')
  const score = div.querySelector('span.rate-score')
  const input = div.querySelector('input#productRate')
  stars.forEach((star, index) => {
    star.addEventListener('click', function() {
      score.innerText = index+1
      input.setAttribute('value', index+1)
      for (var i = 0; i < stars.length; i++) {
        if (i <= index) stars[i].style.color = 'orange'
        else stars[i].style.color = 'black'
      }
    })
  })
})

submitBtn.onclick = function() {
  if (isRated === 'true') return false
}