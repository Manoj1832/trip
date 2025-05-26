const summaryDiv = document.getElementById("summaryDetails");
const btnFeedback = document.getElementById("btnFeedback");
const btnHome = document.getElementById("btnHome");

// Get URL params and localStorage/sessionStorage data
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get("type");
const bookingId = urlParams.get("id") || localStorage.getItem("bookingId");
const txnId = localStorage.getItem("txnId");
const amount = localStorage.getItem("amount");
const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

summaryDiv.innerHTML = `<p>Loading booking details...</p>`;

async function fetchBookingDetails() {
  if (!bookingId || !type) {
    summaryDiv.innerHTML = `<p class="text-danger">Booking details missing or invalid.</p>`;
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/${type}-bookings/${bookingId}`);
    if (!res.ok) throw new Error("Failed to fetch booking details");
    const booking = await res.json();

    const travelId = booking[`${type}Id`];
    const itemRes = await fetch(`http://localhost:5000/api/${type}s/${travelId}`);
    const item = itemRes.ok ? await itemRes.json() : null;

    summaryDiv.innerHTML = `
      <div class="detail-row"><span class="label">Passenger Name:</span> <span class="value">${booking.name || userDetails?.name || 'N/A'}</span></div>
      <div class="detail-row"><span class="label">Email:</span> <span class="value">${booking.email || userDetails?.email || 'N/A'}</span></div>
      <div class="detail-row"><span class="label">Seats Booked:</span> <span class="value">${booking.seats || 'N/A'}</span></div>
      <hr>
      <div class="detail-row"><span class="label">${type === "flight" ? "Airline" : "Train Name"}:</span> <span class="value">${item ? (type === "flight" ? item.airline : item.trainName) : "N/A"}</span></div>
      <div class="detail-row"><span class="label">Route:</span> <span class="value">${item ? `${item.from} → ${item.to}` : "N/A"}</span></div>
      <div class="detail-row"><span class="label">Date:</span> <span class="value">${item ? item.date : "N/A"}</span></div>
      <div class="detail-row"><span class="label">Departure Time:</span> <span class="value">${item ? item.departureTime : "N/A"}</span></div>
      <div class="detail-row"><span class="label">Arrival Time:</span> <span class="value">${item ? item.arrivalTime : "N/A"}</span></div>
      <hr>
      <div class="detail-row"><span class="label">Total Amount Paid:</span> <span class="value">₹${amount || "N/A"}</span></div>
      <div class="detail-row"><span class="label">Transaction ID:</span> <span class="value">${txnId || "N/A"}</span></div>
    `;

    await saveBookingSummary({ type, booking, item, txnId, amount, userDetails });

  } catch (error) {
    console.error("Error loading booking summary:", error);
    summaryDiv.innerHTML = `<p class="text-danger">Could not load booking summary.</p>`;
  }
}

async function saveBookingSummary(data) {
  try {
    const res = await fetch("http://localhost:5000/api/bookings/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      console.error("Error saving summary:", result.error);
    } else {
      console.log("✅ Booking summary saved");
    }
  } catch (err) {
    console.error("Failed to save summary:", err);
  }
}

btnFeedback.addEventListener("click", () => window.location.href = "feedback.html");
btnHome.addEventListener("click", () => window.location.href = "index.html");

fetchBookingDetails();
