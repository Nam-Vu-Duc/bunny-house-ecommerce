var getPreparingButton  = document.querySelector('label#preparing')
var getDeliveringButton = document.querySelector('label#delivering')
var getDoneButton       = document.querySelector('label#done')

importLinkCss('/css/admin/detailOrder.css')

if (orderStatus === 'preparing') {
  getPreparingButton.style.backgroundColor = 'white'
  getPreparingButton.style.color = 'red'
}
if (orderStatus === 'delivering') {
  getDeliveringButton.style.backgroundColor = 'white'
  getDeliveringButton.style.color = 'red'
}
if (orderStatus === 'done') {
  getDoneButton.style.backgroundColor = 'white'
  getDoneButton.style.color = 'red'
}

getPreparingButton.onclick = function() {
  getPreparingButton.style.backgroundColor = 'white'
  getPreparingButton.style.color = 'red'

  getDeliveringButton.style.backgroundColor = ''
  getDeliveringButton.style.color = ''

  getDoneButton.style.backgroundColor = ''
  getDoneButton.style.color = ''
}

getDeliveringButton.onclick = function() {
  getPreparingButton.style.backgroundColor = ''
  getPreparingButton.style.color = ''

  getDeliveringButton.style.backgroundColor = 'white'
  getDeliveringButton.style.color = 'red'

  getDoneButton.style.backgroundColor = ''
  getDoneButton.style.color = ''
}

getDoneButton.onclick = function() {
  getPreparingButton.style.backgroundColor = ''
  getPreparingButton.style.color = ''

  getDeliveringButton.style.backgroundColor = ''
  getDeliveringButton.style.color = ''

  getDoneButton.style.backgroundColor = 'white'
  getDoneButton.style.color = 'red'
}
