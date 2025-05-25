const form = document.getElementById('busBookingForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = {
        userName: document.getElementById('userName').value,
        userEmail: document.getElementById('userEmail').value,
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        travelDate: document.getElementById('travelDate').value,
        operator: document.getElementById('operator').value,
        seats: document.getElementById('seats').value,
        price: document.getElementById('price').value
      };

      try {
        const res = await fetch('http://localhost:5000/api/book-bus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        const result = await res.json();
        const msgDiv = document.getElementById('responseMessage');
        msgDiv.innerHTML = result.success
          ? `<div class="alert alert-success">${result.message}</div>`
          : `<div class="alert alert-danger">${result.message || 'Booking failed'}`;
      } catch (err) {
        console.error('Booking error', err);
        document.getElementById('responseMessage').innerHTML =
          `<div class="alert alert-danger">Error booking bus ticket</div>`;
      }
    });