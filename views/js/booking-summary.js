window.addEventListener("DOMContentLoaded", () => {
  const summaryDiv = document.getElementById("summaryDetails");

  // Retrieve saved data from localStorage
  const txnId = localStorage.getItem("txnId");
  const amount = localStorage.getItem("amount");
  const bookingId = localStorage.getItem("bookingId");
  const bookingType = localStorage.getItem("bookingType");
  const seats = localStorage.getItem("seats");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));

  if (!bookingId || !userDetails) {
    summaryDiv.innerHTML = `<p>No booking data found.</p>`;
    return;
  }

  // Build the summary HTML
  const html = `
    <div class="detail-row"><span class="label">Transaction ID:</span> <span class="value">${txnId}</span></div>
    <div class="detail-row"><span class="label">Booking ID:</span> <span class="value">${bookingId}</span></div>
    <div class="detail-row"><span class="label">Name:</span> <span class="value">${userDetails.name}</span></div>
    <div class="detail-row"><span class="label">Email:</span> <span class="value">${userDetails.email}</span></div>
    <div class="detail-row"><span class="label">Age:</span> <span class="value">${userDetails.age || 'N/A'}</span></div>
    <div class="detail-row"><span class="label">Seats:</span> <span class="value">${seats}</span></div>
    <div class="detail-row"><span class="label">Booking Type:</span> <span class="value">${bookingType === 'train' ? 'Train Ticket' : 'Flight Ticket'}</span></div>
    <div class="detail-row"><span class="label">Total Price:</span> <span class="value">₹${amount}</span></div>
  `;

  summaryDiv.innerHTML = html;

  // Optional: Add button event listeners
  document.getElementById("btnHome").addEventListener("click", () => {
    window.location.href = "index.html"; // Change to your home page
  });

  document.getElementById("btnFeedback").addEventListener("click", () => {
    window.location.href = "feedback.html"; // Change to your feedback page
  });
});
