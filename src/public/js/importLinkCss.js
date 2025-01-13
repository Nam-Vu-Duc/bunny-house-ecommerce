function importLinkCss(cssFile) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssFile
  link.media = 'print'
  link.onload = function() {link.media = 'all'}
  console.log('hello')
  document.head.appendChild(link)
}