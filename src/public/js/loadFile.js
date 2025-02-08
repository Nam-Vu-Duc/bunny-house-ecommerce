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
    await loadScript('/js/checkInput.js')
    await loadScript('/js/importLinkCss.js')
    await loadScript('/js/pagination.js')
    await loadScript('/js/pushNotification.js')
    await loadScript('/js/sortAndFilter.js')
    await loadScript('/js/exportJs.js')
    await loadScript(file)
    
    console.log('All scripts loaded successfully')
  } catch (error) {
    console.error(error)
  }
}