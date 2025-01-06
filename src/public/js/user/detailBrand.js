const metaContent = brandDetails.slice(0, 150) + '...'
const productOldPrices = document.querySelectorAll('h4#product-old-price')
const productPrices = document.querySelectorAll('h3#product-price')

document.addEventListener("DOMContentLoaded", function() {
  const metaDescription = document.querySelector("meta[name='description']");
  metaDescription.setAttribute("content", metaContent);
})
productOldPrices.forEach((item) => {
  item.innerText = item.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'  
})
productPrices.forEach((item) => {
  item.innerText = item.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
})