document.addEventListener("DOMContentLoaded", async () => {
  const txnId = localStorage.getItem("txnId");
  const bookingId = localStorage.getItem("bookingId");
  const bookingType = localStorage.getItem("bookingType");
  const amount = localStorage.getItem("amount");
  const seats = localStorage.getItem("seats");
  const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");

  const summaryContainer = document.getElementById("summaryDetails");

  if (!txnId || !bookingId || !bookingType || !userDetails.name) {
    summaryContainer.innerHTML = `<p class="text-danger">❌ No booking summary found.</p>`;
    return;
  }

  // Render summary to the page
  summaryContainer.innerHTML = `
    <div class="detail-row"><span class="label">Transaction ID:</span> <span class="value">${txnId}</span></div>
    <div class="detail-row"><span class="label">Booking ID:</span> <span class="value">${bookingId}</span></div>
    <div class="detail-row"><span class="label">Name:</span> <span class="value">${userDetails.name}</span></div>
    <div class="detail-row"><span class="label">Email:</span> <span class="value">${userDetails.email}</span></div>
    <div class="detail-row"><span class="label">Age:</span> <span class="value">${userDetails.age}</span></div>
    <div class="detail-row"><span class="label">Seats:</span> <span class="value">${seats}</span></div>
    <div class="detail-row"><span class="label">Type:</span> <span class="value">${bookingType}</span></div>
    <div class="detail-row"><span class="label">Total Amount:</span> <span class="value">₹${amount}</span></div>
  `;

  // Save summary to backend
  try {
    const response = await fetch("http://localhost:5000/api/booking-summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        txnId,
        bookingId,
        bookingType,
        user: {
          name: userDetails.name,
          email: userDetails.email,
          age: userDetails.age,
        },
        seats: parseInt(seats),
        amount: parseFloat(amount),
        date: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error("❌ Failed to save booking summary");
    } else {
      console.log("✅ Booking summary saved to backend.");
    }
  } catch (err) {
    console.error("❌ Error saving booking summary:", err);
  }

   // Feedback button click handler
  btnFeedback.addEventListener('click', () => {
    // Redirect to feedback page or open feedback modal
    window.location.href = 'feedback.html'; // adjust as needed
  });

  // Home button click handler
  btnHome.addEventListener('click', () => {
    window.location.href = 'index.html'; // or your homepage url
  });
  
});
