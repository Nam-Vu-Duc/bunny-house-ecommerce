var p_tags = document.querySelectorAll('p#product-rate')
p_tags.forEach((p_tag) => {
  var score = p_tag.querySelector('span#rate-score').innerText
  score = Math.floor(parseInt(score))
  var stars = p_tag.querySelectorAll('i')
  stars.forEach((star, index) => {
    if (index + 1 <= score) star.style.color = 'orange'
  })
})