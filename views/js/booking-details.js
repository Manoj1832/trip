document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem('tripUser'));
  if (!user || !user.email) {
    alert("Please log in to view bookings.");
    window.location.href = "index.html";
    return;
  }

  const email = user.email;

  try {
    const res = await fetch(`http://localhost:5000/api/bookings?email=${email}`);
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
        <h5 class="card-title">${booking.name}</h5>
        <p class="card-text"><strong>Email:</strong> ${booking.email}</p>
        <p class="card-text"><strong>Date:</strong> ${booking.date || 'N/A'}</p>
        <p class="card-text"><strong>Seats:</strong> ${booking.seats || 1}</p>
        <p class="card-text"><strong>Price:</strong> ₹${booking.price}</p>
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
