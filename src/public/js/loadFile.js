function loadFile(file) {
  const checkInputScript = document.createElement('script')
  checkInputScript.src = '/js/checkInput.js'
  document.head.appendChild(checkInputScript)

  const importLinkScript = document.createElement('script')
  importLinkScript.src = '/js/importLinkCss.js'
  document.head.appendChild(importLinkScript)

  const paginationScript = document.createElement('script')
  paginationScript.src = '/js/pagination.js'
  document.head.appendChild(paginationScript)

  const pushNotificationScript = document.createElement('script')
  pushNotificationScript.src = '/js/pushNotification.js'
  document.head.appendChild(pushNotificationScript)
  
  setTimeout(() => {
    const fileScript = document.createElement('script')
    fileScript.src = file
    document.head.appendChild(fileScript)
  }, 100)
}