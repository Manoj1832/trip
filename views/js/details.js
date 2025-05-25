window.addEventListener('DOMContentLoaded', () => {
  const bookingData = JSON.parse(localStorage.getItem('bookingData'));

  if (!bookingData) {
    document.getElementById("details").innerHTML = "<p class='no-data'>No booking data found.</p>";
    return;
  }

  document.getElementById('name').textContent = bookingData.name || 'N/A';
  document.getElementById('email').textContent = bookingData.email || 'N/A';
  document.getElementById('destination').textContent = bookingData.destination || 'N/A';
  document.getElementById('departureDate').textContent = bookingData.departureDate || 'N/A';
  document.getElementById('arrivalDate').textContent = bookingData.arrivalDate || 'N/A';
  document.getElementById('travelers').textContent = bookingData.travelers || 'N/A';
  document.getElementById('price').textContent = bookingData.totalPrice || '0';
  document.getElementById('paymentMethod').textContent = bookingData.paymentMethod || 'N/A';
  document.getElementById('bookingId').textContent = bookingData.bookingId || 'N/A';
  document.getElementById('transactionId').textContent = bookingData.transactionId || 'N/A';
});
