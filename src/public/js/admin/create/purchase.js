const productPrice = Array.from(document.querySelectorAll('p#product-price'))
productPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})

const input = document.querySelector('input')
const product = Array.from(document.querySelectorAll('div.product')) 
const productName = Array.from(document.querySelectorAll('p.product-name')).map((item) => {
  return item.innerText
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .replace(/đ/g, 'd')             // Replace 'đ' with 'd'
    .replace(/Đ/g, 'D')             // Replace 'Đ' with 'D'
    .toLowerCase();                 // Convert to lowercase
})
const tbody = document.querySelector('tbody')
input.addEventListener('input', function() {
  const value = input.value
  console.log(value)
  productName.forEach((item, index) => {
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
    const name = productName[index]
    const price = productPrice[index].innerText
    const newRow = document.createElement('tr')
    const prdName = document.createElement('td')
    const prdPrice = document.createElement('td')
    const test1 = document.createElement('td')
    const test2 = document.createElement('td')
    const test3 = document.createElement('td')
    const test4 = document.createElement('td')

    prdName.append(name)
    prdPrice.append(price)

    newRow.appendChild(test1)
    newRow.appendChild(prdName)
    newRow.appendChild(prdPrice)
    newRow.appendChild(test2)
    newRow.appendChild(test3)
    newRow.appendChild(test4)

    tbody.appendChild(newRow)
  }
})