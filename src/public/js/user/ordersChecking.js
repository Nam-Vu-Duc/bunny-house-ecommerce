var getOrderCheckingForm   = document.querySelector('form#form-5')
var getSubmitButton        = getOrderCheckingForm.querySelector('button')
var getOrderContainer      = document.querySelector('div.order-checking-container')
var errorMessage           = document.querySelector('span.error-message')

// when submit, the form will push the input value from user to the URL for backend
getSubmitButton.onclick = function () {
  var orderCode = getOrderCheckingForm.querySelector('input').value
  var regex = /^[a-f\d]{24}$/i
  if (regex.test(orderCode)) {
    // if matched, submit form and pass value to URL for backend
    getOrderCheckingForm.setAttribute('method', 'get')
    getOrderCheckingForm.setAttribute('action', `/all-orders/checking/${orderCode}`)
    getOrderCheckingForm.submit()
  }
  else {
    // if not matched, prevent submit, enter again
    getOrderCheckingForm.onsubmit = function (e) { e.preventDefault() }
    errorMessage.innerText = 'Mã Sản Phẩm Không Đúng'
    errorMessage.style.color = 'red'
    getOrderContainer.removeChild(orderProcess)
  }
}

if (orderInfo) {
  var orderProcess = document.createElement('div')
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
          <td>${orderCreatedAt}</td>
          <td>${customerName}</td>
          <td>${orderStatus}</td>
          <td><a href="/all-orders/order/${orderId}">Xem</td>
        </tr>
      </tbody>
    </table>            
  `
  getOrderContainer.appendChild(orderProcess)
}
else {
  errorMessage.innerText = 'Không Tìm Thấy Đơn Hàng'
  errorMessage.style.color = 'red'
  getOrderContainer.removeChild(orderProcess)
}