importLinkCss('/css/user/profile.css')

pushNotification(successful)

var maleGender = document.querySelector('input#male')
var femaleGender = document.querySelector('input#female')
if (gender === 'male') maleGender.checked = true
if (gender === 'female') femaleGender.checked = true

// submit update profile form
var updateProfileForm = document.querySelector('form.update-profile')
var updateProfileButton = document.querySelector('div.submit-button').querySelector('button')

updateProfileButton.onclick = function() {
  updateProfileForm.submit()
}