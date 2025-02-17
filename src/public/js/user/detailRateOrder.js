pushNotification(successful)

const submitBtn = document.querySelector("button[type='submit']")
const rateForm = document.querySelector('form#form-1')
const rateDiv = document.querySelectorAll('div.rate-star')

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
  else rateForm.submit()
}