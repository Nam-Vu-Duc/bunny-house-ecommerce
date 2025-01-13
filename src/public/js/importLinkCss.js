function importLinkCss(cssFile) {
  var link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssFile
  link.media = 'print'
  link.onload = function() {link.media = 'all'}
  document.head.appendChild(link)
}