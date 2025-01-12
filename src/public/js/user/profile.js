var profileButton     = document.querySelector('li.profile')
var ordersButton      = document.querySelector('li.orders')
var rateButton        = document.querySelector('li.rate-orders')
var feedbackButton    = document.querySelector('li.feedback')
var contentContainer  = document.querySelector('div.content')

// display profile update on first loaded page
if (contentContainer.innerText === '') showProfile()

// submit update profile form
var updateProfileForm = document.querySelector('form.update-profile')
var updateProfileButton = document.querySelector('div.update-profile-button').querySelector('button')

updateProfileButton.onclick = function() {
  updateProfileForm.submit()
}

profileButton.onclick   = showProfile
ordersButton.onclick    = showOrders
rateButton.onclick      = showRateOrders
feedbackButton.onclick  = showFeedback

function showProfile() {
  contentContainer.innerHTML = `
    <p>Thông Tin Cá Nhân</p>

    <form class="update-profile" method="POST" action="/profile/updated/{{userInfo._id}}?_method=PUT">
      <div class="form-group">
        <label for="name">Tên Khách Hàng</label>
        <input 
          type="text" 
          class="form-control" 
          id="name" 
          name="name" 
          value="{{userInfo.userInfo.name}}"
        >
      </div>

      <div class="form-group">
        <label for="gender">Giới tính</label>
        <div>
          <input type="radio" id="male" name="gender" value="male">
          <label for="cash">Nam</label>
          
          <input type="radio" id="female" name="gender" value="female">
          <label for="cashless">Nữ</label>
        </div>
      </div>

      <div class="form-group">
        <label for="phone">Số điện thoại</label>
        <input 
          type="text" 
          class="form-control" 
          id="phone" 
          name="phone" 
          value="{{userInfo.userInfo.phone}}"
        >
      </div>

      <div class="form-group">
        <label for="address">Địa chỉ nhận hàng</label>
        <input 
          type="text" 
          class="form-control" 
          id="address" 
          name="address" 
          value="{{userInfo.userInfo.address}}"
        >
      </div>
    </form> 

    <div class="update-profile-button">
      <button type="submit">Cập Nhật</button>
    </div>
  `
  var maleGender = document.querySelector('input#male')
  var femaleGender = document.querySelector('input#female')
  if (`{{userInfo.userInfo.gender}}` === 'male') maleGender.checked = true
  if (`{{userInfo.userInfo.gender}}` === 'female') femaleGender.checked = true

  // submit update profile form
  var updateProfileForm = document.querySelector('form.update-profile')
  var updateProfileButton = document.querySelector('div.update-profile-button').querySelector('button')

  updateProfileButton.onclick = function() {
    updateProfileForm.submit()
  }
}
function showOrders() {
  contentContainer.innerHTML = `
    <p>Thông Tin Đơn Hàng</p>

    <table style="width:100%">
      <thead>
        <tr>
          <td style="width: 25%">Người Nhận</td>
          <td style="width: 25%">Tổng Tiền</td>
          <td style="width: 20%">Ngày</td>
          <td style="width: 15%">Tình Trạng</td>
          <td style="width: 15%">Chi tiết</td>
        </tr>
      </thead>
      <tbody>
        {{#each orderInfo}}
          {{#if (isEqual this.status 'done')}}
          {{^}}
            <tr>
              <td>{{this.customerInfo.name}}</td>
              <td class="total-price">{{this.totalOrderPrice}}</td>
              <td>{{formatDate this.createdAt}}</td>
              <td>{{formatStatus this.status}}</td>
              <td><a href="/all-orders/order/{{this._id}}">Chi Tiết</a></td>
            </tr>
          {{/if}}
        {{/each}}
      </tbody>
    </table>
  `
  var totalPrice = document.querySelectorAll('td.total-price')
  totalPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
}
function showRateOrders() {
  contentContainer.innerHTML = `
    <p>Đánh giá Đơn Hàng</p>

    <table style="width:100%">
      <thead>
        <tr>
          <td>Người Nhận</td>
          <td>Tổng Tiền</td>
          <td>Ngày</td>
          <td>Tình Trạng</td>
          <td>Đánh giá</td>
        </tr>
      </thead>
      <tbody>
        {{#each orderInfo}}
          {{#if (isEqual this.status 'done')}}
            <tr>
              <td style="width: 25%">{{this.customerInfo.name}}</td>
              <td style="width: 25%" class="total-price">{{this.totalOrderPrice}}</td>
              <td style="width: 20%">{{formatDate this.createdAt}}</td>
              <td style="width: 15%">{{formatStatus this.status}}</td>
              <td style="width: 15%"><a href="/all-orders/order/rate/{{this._id}}">Đánh giá</a></td>
            </tr>
          {{/if}}
        {{/each}}
      </tbody>
    </table>
  `
  var totalPrice = document.querySelectorAll('td.total-price')
  totalPrice.forEach((price) => {price.innerText = price.innerText.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'})
}
function showFeedback() {
  contentContainer.innerHTML = `
    <p>Góp ý</p>
    <form class="update-feedback" method="POST" action="/profile/updated/{{user._id}}?_method=PUT">
      <div class="form-group">
        <label for="phone">Bạn có góp ý gì cho mình thì điền vô đây nha</label>
        <input 
          type="text" 
          class="form-control" 
          id="phone" 
          name="phone" 
        >
      </div>
    </form> 

    <div class="update-feedback-button">
      <button type="submit">Cập Nhật</button>
    </div>
  `
  var updateFeedbackForm = document.querySelector('form.update-feedback')
  var updateFeedbackButton = document.querySelector('div.update-feedback-button').querySelector('button')
}