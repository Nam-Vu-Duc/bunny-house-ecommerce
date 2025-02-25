// ok
importLinkCss('/css/admin/createProduct.css')

const selectBox    = document.querySelector('select[name="categories"]')
const skincareBox  = document.querySelector('select[name="skincare"]').parentElement
const makeUpBox    = document.querySelector('select[name="makeup"]').parentElement
const submitButton = document.querySelector('button[type="submit"]')
const img          = document.querySelector('input#img')
const imgPath      = {path: ''}

selectBox.onchange = function() {
  const selectedValue = selectBox.options[selectBox.selectedIndex].value;
  if (selectedValue === 'skincare') {
    skincareBox.style.display = ''
    makeUpBox.style.display = 'none'
  }
  if (selectedValue === 'makeup') {
    skincareBox.style.display = 'none'
    makeUpBox.style.display = ''
  }
}

formatInputNumber(document.querySelector('input[name="oldPrice"]'))

formatInputNumber(document.querySelector('input[name="price"]'))

img.addEventListener('change', function () {
  const file = img.files[0]; // Get the selected file
  const reader = new FileReader()
  reader.onload = function () {
    imgPath.path = reader.result; // Base64-encoded string
  }
  reader.readAsDataURL(file)
})

async function createProduct() {
  const categories  = document.querySelector('select[name="categories"]').value
  const skincare    = document.querySelector('select[name="skincare"]').value
  const makeup      = document.querySelector('select[name="makeup"]').value
  const brand       = document.querySelector('select[name="brand"]').value
  const name        = document.querySelector('input#name').value
  const oldPrice    = deFormatNumber(document.querySelector('input#oldPrice').value) 
  const price       = deFormatNumber(document.querySelector('input#price').value)
  const description = document.querySelector('input#description').value
  const details     = document.querySelector('input#details').value
  const guide       = document.querySelector('input#guide ').value
  const status      = document.querySelector('select[name="status"]').value

  if (!categories || !brand || !name || !oldPrice || !price || !description || !details || !guide || !status || !img ) {
    pushNotification("Hãy điền đầy đủ các thông tin!")
    return
  }

  const response = await fetch('/admin/all-products/product/created', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      categories  : categories,
      skincare    : skincare,
      makeup      : makeup,
      brand       : brand,
      name        : name,
      oldPrice    : oldPrice,
      price       : price,
      description : description,
      details     : details,
      guide       : guide,
      status      : status,
      img         : imgPath.path,
    })
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const { isValid, message } = await response.json()

  pushNotification(message)
  
  if (!isValid) return 
  setTimeout(() => window.location.reload(), 2000)
}

submitButton.onclick = function() {
  createProduct()
}