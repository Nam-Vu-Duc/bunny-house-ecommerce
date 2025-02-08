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

  const sortAndFilterScript = document.createElement('script')
  sortAndFilterScript.src = '/js/sortAndFilter.js'
  document.head.appendChild(sortAndFilterScript)
  
  const exportJsScript = document.createElement('script')
  exportJsScript.src = '/js/exportJs.js'
  document.head.appendChild(exportJsScript)
  
  setTimeout(() => {
    const fileScript = document.createElement('script')
    fileScript.src = file
    document.head.appendChild(fileScript)
  }, 150)
}