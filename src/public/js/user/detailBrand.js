const metaContent = brandDetails.slice(0, 150) + '...'
document.addEventListener("DOMContentLoaded", function() {
  const metaDescription = document.querySelector("meta[name='description']");
  metaDescription.setAttribute("content", metaContent);
})