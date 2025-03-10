importLinkCss('/css/admin/attribute.css')

async function getMembership() {
  const response = await fetch('/admin/all-attributes/data/membership')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">HẠNG THÀNH VIÊN</td></tr>
    </thead>
    <thead>
      <tr>
        <td>Mã</td>
        <td>Tên</td>
        <td>Thao tác</td>
      </tr>
    <tbody>
      ${data.map(item => 
        `
          <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td><i class="fi fi-tr-trash-slash"></i></td>
          </tr>
        `
      ).join("")}
      <td colspan="3">Thêm</td>
    </tbody>
  `

  document.querySelector('div.membership').appendChild(table)
}

async function getOrderStatus() {
  const response = await fetch('/admin/all-attributes/data/order-status')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">HẠNG THÀNH VIÊN</td></tr>
    </thead>
    <thead>
      <tr>
        <td>Mã</td>
        <td>Tên</td>
        <td>Thao tác</td>
      </tr>
    <tbody>
      ${data.map(item => 
        `
          <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td><i class="fi fi-tr-trash-slash"></i></td>
          </tr>
        `
      ).join("")}
      <td colspan="3">Thêm</td>
    </tbody>
  `

  document.querySelector('div.order-status').appendChild(table)
}

async function getPaymentMethod() {
  const response = await fetch('/admin/all-attributes/data/payment-method')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">PHƯƠNG THƯC THANH TOÁN</td></tr>
    </thead>
    <thead>
      <tr>
        <td>Mã</td>
        <td>Tên</td>
        <td>Thao tác</td>
      </tr>
    <tbody>
      ${data.map(item => 
        `
          <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td><i class="fi fi-tr-trash-slash"></i></td>
          </tr>
        `
      ).join("")}
      <td colspan="3">Thêm</td>
    </tbody>
  `

  document.querySelector('div.payment-method').appendChild(table)
}

async function getPosition() {
  const response = await fetch('/admin/all-attributes/data/position')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">VỊ TRÍ CÔNG VIỆC</td></tr>
    </thead>
    <thead>
      <tr>
        <td>Mã</td>
        <td>Tên</td>
        <td>Thao tác</td>
      </tr>
    <tbody>
      ${data.map(item => 
        `
          <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td><i class="fi fi-tr-trash-slash"></i></td>
          </tr>
        `
      ).join("")}
      <td colspan="3">Thêm</td>
    </tbody>
  `

  document.querySelector('div.position').appendChild(table)
}

async function getProductStatus() {
  const response = await fetch('/admin/all-attributes/data/product-status')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">TRẠNG THÁI SẢN PHẨM</td></tr>
    </thead>
    <thead>
      <tr>
        <td>Mã</td>
        <td>Tên</td>
        <td>Thao tác</td>
      </tr>
    <tbody>
      ${data.map(item => 
        `
          <tr>
          <td>${item.code}</td>
          <td>${item.name}</td>
          <td><i class="fi fi-tr-trash-slash"></i></td>
          </tr>
        `
      ).join("")}
      <td colspan="3">Thêm</td>
    </tbody>
  `

  document.querySelector('div.product-status').appendChild(table)
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  await getMembership()
  await getOrderStatus()
  await getPaymentMethod()
  await getPosition()
  await getProductStatus()
})