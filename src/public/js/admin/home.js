importLinkCss('/css/admin/home.css')

const customer  = document.getElementById('customer')
const purchase  = document.getElementById('purchase')
const order     = document.getElementById('order')
const store     = document.getElementById('store')
const product   = document.getElementById('product')
const employee  = document.getElementById('employee')
const supplier  = document.getElementById('supplier')
const brand     = document.getElementById('brand')

new Chart(customer, {
type: 'bar',
data: {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: 'THỐNG KÊ KHÁCH HÀNG',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1,
    backgroundColor: '#FFDFDF'
  }]
},
options: {
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
})