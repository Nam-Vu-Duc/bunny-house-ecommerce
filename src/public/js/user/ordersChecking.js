// ok
import { format } from 'https://cdn.jsdelivr.net/npm/date-fns@latest/+esm';
const submitButton   = document.querySelector('button')
const orderContainer = document.querySelector('div.order-checking-container')
const errorMessage   = document.querySelector('span.error-message')

async function getOrder(id) {
  const response = await fetch('/all-orders/data/order', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id: id})
  })
  if (!response.ok) throw new Error(`Response status: ${response.status}`)
  const json = await response.json()
  const data = json.data
  const status = json.status

  return {data: data, status: status}
}

function appendOrder(data, status) {
  const table = document.querySelector('table')
  if (table) table.remove()
  document.querySelector('span.error-message').textContent = ''
  const orderProcess = document.createElement('div')
  orderProcess.setAttribute('class', 'order-process')
  orderProcess.innerHTML = `
    <table>
      <thead>
        <tr>
          <td style="width: 20%">Ngày Đặt</td>
          <td style="width: 20%">Người Đặt</td>
          <td style="width: 50%">Tiến Độ</td>
          <td style="width: 10%">Chi tiết</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${formatDate(data.createdAt)}</td>
          <td>${data.customerInfo.name}</td>
          <td>${status.name}</td>
          <td><a href="/all-orders/order/${data._id}">Xem</td>
        </tr>
      </tbody>
    </table>            
  `
  orderContainer.appendChild(orderProcess)
  submitButton.classList.remove('loading')
}

function formatDate(date) {
  return format(new Date(date), 'dd/MM/yyyy')
}

// when submit, the form will push the input value from user to the URL for backend
submitButton.onclick = async function () {
  submitButton.classList.add('loading')
  const orderCode = document.querySelector('input').value
  const regex = /^[a-f\d]{24}$/i
  if (regex.test(orderCode)) {
    const {data, status}  = await getOrder(orderCode)
    if (data) return appendOrder(data, status)
    errorMessage.innerText = 'Không Tìm Thấy Đơn Hàng'
    errorMessage.style.color = 'red'
    const table = document.querySelector('table')
    if (table) table.remove()
  }
  else {
    // if not matched, prevent submit, enter again
    errorMessage.innerText = 'Mã Sản Phẩm Không Đúng'
    errorMessage.style.color = 'red'
    const table = document.querySelector('table')
    if (table) table.remove()
  }
  submitButton.classList.remove('loading')
}