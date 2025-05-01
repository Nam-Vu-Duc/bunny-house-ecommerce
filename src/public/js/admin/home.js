importLinkCss('/css/admin/home.css')

async function getFinance() {
  const response = await fetch('/admin/all/data/brands')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ TÀI CHÍNH</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng thương hiệu</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-brands">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.finance').appendChild(table)

  new Chart(brand, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getBrands() {
  const response = await fetch('/admin/all/data/brands')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ THƯƠNG HIỆU</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng thương hiệu</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-brands">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.brand').appendChild(table)

  new Chart(brand, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getCustomers() {
  const response = await fetch('/admin/all/data/customers')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ KHÁCH HÀNG</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng khách hàng</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-customers">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.customer').appendChild(table)

  new Chart(customer, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getEmployees() {
  const response = await fetch('/admin/all/data/employees')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ NHÂN SỰ</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng nhân sự</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-employees">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.employee').appendChild(table)

  new Chart(employee, {
    type: 'bar',
    data: {
      labels: ['Nhân viên', 'Quản lý', 'Quản trị'],
      datasets: [{
        label: 'VỊ TRÍ',
        data: [
          data.filter(emp => emp.role === 'employee').length, 
          data.filter(emp => emp.role === 'manager').length,
          data.filter(emp => emp.role === 'admin').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getOrders() {
  const response = await fetch('/admin/all/data/orders')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ ĐƠN HÀNG</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng đơn hàng</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-orders">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.order').appendChild(table)

  new Chart(order, {
    type: 'bar',
    data: {
      labels: ['Đang chuẩn bị', 'Đang giao', 'Hoàn thành', 'Huỷ'],
      datasets: [{
        label: 'TRẠNG THÁI',
        data: [
          data.filter(order => order.status === 'preparing').length, 
          data.filter(order => order.status === 'delivering').length,
          data.filter(order => order.status === 'done').length,
          data.filter(order => order.status === 'cancel').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getProducts() {
  const response = await fetch('/admin/all/data/products')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ SẢN PHẨM</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng sản phẩm</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-products/?page=&type=">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.product').appendChild(table)

  new Chart(product, {
    type: 'bar',
    data: {
      labels: ['Skincare', 'Makeup'],
      datasets: [{
        label: 'LOẠI',
        data: [
          data.filter(product => product.categories === 'skincare').length, 
          data.filter(product => product.categories === 'makeup').length,
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getPurchases() {
  const response = await fetch('/admin/all/data/purchases')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ NHẬP HÀNG</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng đơn nhập</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-purchases">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.purchase').appendChild(table)

  new Chart(purchase, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getStores() {
  const response = await fetch('/admin/all/data/stores')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ CỬA HÀNG</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng cửa hàng</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-stores">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.store').appendChild(table)

  new Chart(store, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

async function getSuppliers() {
  const response = await fetch('/admin/all/data/suppliers')
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const {data} = await response.json()

  const table = document.createElement('table')
  table.innerHTML = `
    <thead>
      <tr><td colspan="3">QUẢN LÝ ĐỐI TÁC</td></tr>
    </thead>
    <tbody>
      <tr>
        <td>Số lượng đối tác</td>
        <td>${data.length}</td>
        <td><a href="/admin/all-brands">Chi tiết</a></td>
      </tr>
    </tbody>
  `

  document.querySelector('div.supplier').appendChild(table)

  new Chart(supplier, {
    type: 'bar',
    data: {
      labels: ['Bạc', 'Vàng', 'Kim cương'],
      datasets: [{
        label: 'HẠNG',
        data: [
          data.filter(user => user.memberCode === 'silver').length, 
          data.filter(user => user.memberCode === 'gold').length,
          data.filter(user => user.memberCode === 'diamond').length
        ],
        borderWidth: 1,
        backgroundColor: '#FFDFDF'
      }]
    }
  })
}

window.addEventListener('DOMContentLoaded', async function loadData() {
  try {
    await getCustomers()
    await new Promise(r => setTimeout(r, 200))

    await getOrders()
    await new Promise(r => setTimeout(r, 200))

    await getSuppliers()
    await new Promise(r => setTimeout(r, 200))
    
    await getPurchases() 
    await new Promise(r => setTimeout(r, 200))

    await getProducts()
    await new Promise(r => setTimeout(r, 200))

    await getBrands()
    await new Promise(r => setTimeout(r, 200))

    await getStores()
    await new Promise(r => setTimeout(r, 200))

    await getEmployees()    
  } catch (error) {
    console.error('Có lỗi xảy ra:', error)
    pushNotification('Có lỗi xảy ra')
  }
})