function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND'
}

function formatRate(number) {
  return number.toFixed(1).toString()
}

function formatDate(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth() + 1; // Months are zero-based
  const year = newDate.getUTCFullYear();
  
  return `${day}/${month}/${year}`;
}