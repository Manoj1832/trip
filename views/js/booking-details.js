document.addEventListener('DOMContentLoaded', () => {
    const userSession = JSON.parse(localStorage.getItem('tripUser'));
    const userEmail = userSession?.email;

  if (!userEmail) {
    alert('Please log in to view your bookings.');
    window.location.href = 'index.html';
    return;
  }

  fetch(`http://localhost:5000/api/user-bookings?email=${encodeURIComponent(userEmail)}`)
    .then(res => res.json())
    .then(data => {
      console.log("Received bookings:", data); // Debug
      updateSection('flight-bookings', data.flights || [], 'flight');
      updateSection('train-bookings', data.trains || [], 'train');
      updateSection('package-bookings', data.packages || [], 'package');
    })
    .catch(err => {
      console.error('Error fetching bookings:', err);
    });
});


function updateSection(containerId, bookings, type) {
  const container = document.getElementById(containerId);
  if (!bookings.length) {
    container.innerHTML = `<p class="text-muted">No ${type} bookings found.</p>`;
    return;
  }

  container.innerHTML = bookings.map(b => {
    const date = new Date(b.bookingDate || b.date).toLocaleDateString();

    // Common details
    const userDetails = `
      <p class="mb-1"><strong>Name:</strong> ${b.userName || 'N/A'}</p>
      <p class="mb-1"><strong>Email:</strong> ${b.userEmail}</p>
    `;

    // Type-specific details
    let bookingDetails = '';
    if (type === 'flight') {
      bookingDetails = `
        <p class="mb-1"><strong>Flight ID:</strong> ${b.flightId}</p>
        <p class="mb-1"><strong>From:</strong> ${b.from}</p>
        <p class="mb-1"><strong>To:</strong> ${b.to}</p>
        <p class="mb-1"><strong>Seats:</strong> ${b.seats || 1}</p>
        <p class="mb-1"><strong>Payment:</strong> ${b.paymentStatus || 'N/A'}</p>
      `;
    } else if (type === 'train') {
      bookingDetails = `
        <p class="mb-1"><strong>Train ID:</strong> ${b.trainId}</p>
        <p class="mb-1"><strong>From:</strong> ${b.from}</p>
        <p class="mb-1"><strong>To:</strong> ${b.to}</p>
        <p class="mb-1"><strong>Seats:</strong> ${b.seats || 1}</p>
        <p class="mb-1"><strong>Payment:</strong> ${b.paymentStatus || 'N/A'}</p>
      `;
    } else if (type === 'package') {
      bookingDetails = `
        <p class="mb-1"><strong>Package Name:</strong> ${b.name}</p>
        <p class="mb-1"><strong>Description:</strong> ${b.description}</p>
        <p class="mb-1"><strong>Location:</strong> ${b.location || 'N/A'}</p>
        <p class="mb-1"><strong>Duration:</strong> ${b.duration || 'N/A'}</p>
        <p class="mb-1"><strong>Price:</strong> ₹${b.totalPrice || 'N/A'}</p>
        <p class="mb-1"><strong>Payment:</strong> ${b.paymentStatus || 'N/A'}</p>
      `;
    }

    return `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0">
          ${type === 'package' && b.image ? `
            <div class="col-md-4">
              <img src="${b.image}" class="img-fluid rounded-start" alt="${b.name}">
            </div>` : ''
          }
          <div class="${type === 'package' && b.image ? 'col-md-8' : 'col-md-12'}">
            <div class="card-body">
              <h5 class="card-title">${type.charAt(0).toUpperCase() + type.slice(1)} Booking</h5>
              ${userDetails}
              ${bookingDetails}
              <p class="card-text"><small class="text-muted">Date: ${date}</small></p>
              ${type !== 'package' ? `
                <button class="btn btn-outline-danger btn-sm mt-2" onclick="cancelBooking('${type}', '${b._id}')">
                  <i class="bi bi-x-circle"></i> Cancel
                </button>` : ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}


function cancelBooking(type, id) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  fetch(`http://localhost:5000/api/cancel-booking/${type}/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      alert(data.message || 'Booking cancelled');
      document.querySelector(`#${type}-bookings`).innerHTML = '<p class="text-muted">Refreshing...</p>';
      return fetch(`http://localhost:5000/api/user-bookings?email=${encodeURIComponent(localStorage.getItem('userEmail'))}`);
    })
    .then(res => res.json())
    .then(data => {
      updateSection(`${type}-bookings`, data[`${type}s`], type);
    })
    .catch(err => {
      console.error(err);
      alert('Cancellation failed');
    });
}

