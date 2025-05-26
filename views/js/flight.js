async function searchFlights() {
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      const date = document.getElementById('date').value;

      const response = await fetch(`http://localhost:5000/api/flights?from=${from}&to=${to}&date=${date}`);
      const flights = await response.json();

      const container = document.getElementById('flightResults');
      container.innerHTML = '';

      if (flights.length === 0) {
        container.innerHTML = '<p>No flights found.</p>';
        return;
      }

      flights.forEach(flight => {
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.innerHTML = `
          <h3>${flight.airline} (${flight.flightNumber})</h3>
          <p><strong>From:</strong> ${flight.from} → <strong>To:</strong> ${flight.to}</p>
          <p><strong>Departure:</strong> ${flight.departureTime} - <strong>Arrival:</strong> ${flight.arrivalTime}</p>
          <p><strong>Duration:</strong> ${flight.duration}</p>
          <p><strong>Date:</strong> ${flight.date}</p>
          <p><strong>Price:</strong> ₹${flight.price}</p>
          <p><strong>Seats Available:</strong> ${flight.seatsAvailable}</p>
          <button onclick="bookFlight('${flight._id}', ${flight.price})">Book Now</button>
        `;
        container.appendChild(card);
      });
    }

    let selectedFlightId = '';
    let selectedFlightPrice = 0;

    function bookFlight(id, price) {
      selectedFlightId = id;
      selectedFlightPrice = price;
      document.getElementById('bookingModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('bookingModal').style.display = 'none';
    }

    document.getElementById("userDetailsForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("passengerName").value.trim();
      const email = document.getElementById("passengerEmail").value.trim();
      const age = document.getElementById("passengerAge").value.trim();
      const seats = document.getElementById("passengerSeats").value.trim();

      if (!name || !email || !age || !seats) {
        alert("Please fill all fields.");
        return;
      }

      sessionStorage.setItem("userDetails", JSON.stringify({ name, email, age, seats }));
      closeModal();
      window.location.href = `payment.html?id=${selectedFlightId}&type=flight&price=${selectedFlightPrice}`;
    });