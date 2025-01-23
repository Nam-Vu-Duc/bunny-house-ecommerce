importLinkCss('/css/user/allProducts.css')

// update main-title base on params.slug
var mainTitle           = document.querySelector('div.main-title').querySelector('b')
var getSkincareCategory = document.querySelector('div.all-category-skincare')
var getMakeupCategory   = document.querySelector('div.all-category-makeup')
var titles = {
  'flash-sale': 'Toàn bộ sản phẩm đang sale',
  'hot': 'Toàn bộ sản phẩm đang hot',
  'new-arrival': 'Toàn bộ sản phẩm mới về',
  'xit-khoang': 'Toàn bộ sản phẩm Xịt khoáng',
  'mat-na': 'Toàn bộ sản phẩm Mặt nạ',
  'serum': 'Toàn bộ sản phẩm Serum',
  'bha': 'Toàn bộ sản phẩm Bha',
  'tay-da-chet': 'Toàn bộ sản phẩm Tẩy da chết',
  'duong-da': 'Toàn bộ sản phẩm Dưỡng da',
  'toner': 'Toàn bộ sản phẩm toner',
  'nuoc-tay-trang': 'Toàn bộ sản phẩm Nước tẩy trang',
  'cham-mun': 'Toàn bộ sản phẩm Chấm mụn',
  'kem-duong-am': 'Toàn bộ sản phẩm Kem dưỡng ẩm',
  'sua-rua-mat': 'Toàn bộ sản phẩm Sữa rửa mặt',
  'phan-ma': 'Toàn bộ sản phẩm Phấn má',
  'mascara': 'Toàn bộ sản phẩm mascara',
  'ke-mat': 'Toàn bộ sản phẩm Kẻ mắt',
  'kem-chong-nang': 'Toàn bộ sản phẩm Kem chống nắng',
  'che-khuyet-diem': 'Toàn bộ sản phẩm Che khuyết điểm',
  'son': 'Toàn bộ sản phẩm son',
  'makeup': 'Toàn bộ sản phẩm makeup',
  'skincare': 'Toàn bộ sản phẩm skincare'
};

if (titles[getSlug]) mainTitle.innerText = titles[getSlug]
else mainTitle.innerText = 'Sản phẩm không xác định'

if (getSlug === 'skincare') {
  getSkincareCategory.innerHTML = `
    <ul>
      <li><a href="/all-products/skincare/xit-khoang">Xịt khoáng<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079975/web-img/mhseyytpn8h6zvg4tabd_r57wfv.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/mat-na">Mặt nạ<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079978/web-img/sfudjh00pykqpvav4sgy_xqbzev.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/serum">Serum<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079970/web-img/kjz3zdlyxo76h1p3t6lm_uk4agl.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/bha">BHA<img src="https://res.cloudinary.com/bunny-store/image/upload/v1730814300/web-img/dfw5hkqs9gww8tzb6q94_amc5t1.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/tay-da-chet">Tẩy da chết<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079964/web-img/ettmlmf7s4x0g8d98nvq_vklnps.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/duong-da">Dưỡng da<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079987/web-img/xkkpidyegeiesbea9rk5_b4tgej.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/toner">Toner<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079967/web-img/k0easo5upkoydszse1i3_jp7mrg.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/nuoc-tay-trang">Nước tẩy trang<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079972/web-img/md2husxtaoo5kmyp6qxy_cmvvnp.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/cham-mun">Chấm mụn<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079961/web-img/almfjrziupsfnxh4ikej_hfcib1.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/kem-duong-am">Kem dưỡng ẩm<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079981/web-img/sznuvy878jkx6irn87wt_molje8.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/skincare/sua-rua-mat">Sữa rửa mặt<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711079959/web-img/zeuznbkrsspuucipy2bh_akixfj.webp" alt="loading" loading="lazy"></a></li>
    </ul>    
  `
}
if (getSlug === 'makeup') {
  getMakeupCategory.innerHTML = `
    <ul>
      <li><a href="/all-products/makeup/phan-ma">Phấn má<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080154/web-img/o1th0fymd3gzjzgwbrbz_ghkt70.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/makeup/mascara">Mascara<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080143/web-img/ejschlqugyhr4asayspm_hbrdiy.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/makeup/ke-mat">Kẻ mắt<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080172/web-img/djy7wut0chooynp65hov_xxbwxi.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/makeup/kem-chong-nang">Kem chống nắng<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080150/web-img/hspzixrzay9whcg51meo_h4iotk.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/makeup/che-khuyet-diem" loading="lazy">Che khuyết điểm<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080188/web-img/vr3yzblr5g0crzkgj9po_e8mrjp.webp" alt="loading" loading="lazy"></a></li>
      <li><a href="/all-products/makeup/son">Son<img src="https://res.cloudinary.com/bunny-store/image/upload/v1711080146/web-img/jd2llxirfbwpdwekk7lz_cpznu5.webp" alt="loading" loading="lazy"></a></li>
    </ul>
  `
}

// pagination 
var pagination = document.querySelector('span.pagination')
var totalPage = 1

// display all pages tag
for (var i = 0; i < productLength; i += 10) {
  var newPage = document.createElement('p')
  newPage.innerText = `${totalPage}`
  pagination.appendChild(newPage)
  totalPage++
}

// Style the current selected page
var allPagesTag = pagination.querySelectorAll('p')
allPagesTag.forEach((tag, index) => {
  if (tag.innerText === currentPage) {
    tag.style.borderColor = '#D1A6A6'
    tag.style.backgroundColor = '#D1A6A6'
    tag.style.color = 'white'
    tag.style.width = '25px'
    tag.style.height = '25px'
  }
  tag.onclick = function() {
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('page', index+1)
    window.location.search = urlParams
  }
})

// sort
var selectButton = document.querySelectorAll('select')
selectButton.forEach((button) => {
  button.onchange = function () {
    const sortType = button.id
    const sortValue = button.value
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set(sortType, sortValue)
    window.location.search = urlParams
  }
  
  const options = button.querySelectorAll('option')
  options.forEach((option) => {
    const sortType = button.id
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get(sortType)) {
      if (option.value === urlParams.get(sortType)) {
        option.setAttribute('selected', 'selected')
      }
    } 
  })
}) 

var clearBtn = document.querySelector('p#clear-filter')
clearBtn.onclick = function() {
  const url = new URL(window.location.href)
  window.location.href = `${url.pathname}`
}