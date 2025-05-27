document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem('tripUser'));
  const email = localStorage.getItem('email');

  if (!user || !user.email || !email) {
    alert("Please log in to view bookings.");
    window.location.href = "index.html";
    return;
  }

  try {
    // ✅ Send request with query param (?email=...)
    const res = await fetch(`http://localhost:5000/api/bookings?email=${encodeURIComponent(email)}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const data = await res.json();

    renderBookings(data.flights, 'flight-bookings', 'flight');
    renderBookings(data.trains, 'train-bookings', 'train');
    renderBookings(data.packages, 'package-bookings', 'package');
  } catch (err) {
    console.error("Failed to load bookings:", err);
    alert("Failed to fetch your bookings. Please try again later.");
  }
});

function renderBookings(bookings, containerId, type) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!bookings || bookings.length === 0) {
    container.innerHTML = `<p class="text-muted">No ${type} bookings found.</p>`;
    return;
  }

  bookings.forEach(booking => {
    const card = document.createElement('div');
    card.className = "card mb-3";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${booking.name || type.toUpperCase()}</h5>
        <p class="card-text"><strong>Email:</strong> ${booking.email}</p>
        <p class="card-text"><strong>Date:</strong> ${booking.bookingDate || 'N/A'}</p>
        <p class="card-text"><strong>Seats:</strong> ${booking.seats || 1}</p>
        <button class="btn btn-danger btn-sm" onclick="cancelBooking('${type}', '${booking._id}')">Cancel Booking</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function cancelBooking(type, id) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  try {
    const res = await fetch(`http://localhost:5000/api/bookings/${type}/${id}`, {
      method: 'DELETE',
    });

    const result = await res.json();

    if (result.success) {
      alert("Booking cancelled successfully.");
      location.reload();
    } else {
      alert("Failed to cancel booking.");
    }
  } catch (err) {
    console.error("Error cancelling booking:", err);
    alert("Something went wrong while cancelling.");
  }
}
