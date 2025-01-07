var getSubmitButton = document.querySelector('div.submit-button').querySelector('button')
var getSubmitForm = document.querySelector('form.admin-update-form')
getSubmitButton.onclick = function() {
  getSubmitForm.submit()
}

// auto checked gender input
var maleGender = document.querySelector('input#male')
var femaleGender = document.querySelector('input#female')
if (userGender === 'male') maleGender.checked = true
if (userGender === 'female') femaleGender.checked = true