async function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(src + ' loaded')
    script.onerror = () => reject(new Error(src + ' failed to load'))
    document.head.appendChild(script)
  })
}

async function loadFile(file) {
  try {
    window.addEventListener('load', () => {
      loadScript('/js/importLinkCss.js')
      loadScript('/js/checkInput.js')
      loadScript('/js/pagination.js')
      loadScript('/js/pushNotification.js')
      loadScript('/js/sortAndFilter.js')
      loadScript('/js/exportJs.js')
      loadScript(file)
      
      console.log('All scripts loaded successfully')
    })
  } catch (error) {
    console.error(error)
  }
}