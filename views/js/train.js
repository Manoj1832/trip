// train.js
let selectedTrainId = '';
let selectedPrice = 0;

document.getElementById('trainSearchForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const date = document.getElementById('date').value;
  const validPattern = /^[A-Za-z\s]+$/;
  if (!validPattern.test(from) || !validPattern.test(to)) {
    alert("Please enter valid city names (letters and spaces only).");
    return;
  }
    if (from.length > 200 || to.length > 200 || date.length > 200) {
    alert("Each input field must not exceed 200 characters.");
    return;
  }
  
  const res = await fetch(`http://localhost:5000/api/trains?from=${from}&to=${to}&date=${date}`);
  const trains = await res.json();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (trains.length === 0) {
    resultsDiv.innerHTML = '<p>No trains found for the selected route and date.</p>';
    return;
  }

  trains.forEach(train => {
    const div = document.createElement('div');
    div.className = 'train-card';
    div.innerHTML = `
      <h3>${train.trainName} (${train.trainNumber})</h3>
      <p>From: ${train.from} → To: ${train.to}</p>
      <p>Date: ${train.date}</p>
      <p>Departure: ${train.departureTime}, Arrival: ${train.arrivalTime}</p>
      <p>Price: ₹${train.price}</p>
      <p>Seats Available: ${train.seatsAvailable}</p>
      <button onclick="bookTrain('${train._id}', ${train.price})">Book Now</button>
    `;
    resultsDiv.appendChild(div);
  });
});

function bookTrain(trainId, price) {
  selectedTrainId = trainId;
  selectedPrice = price;
  document.getElementById("userDetailsModal").style.display = "block";
  document.getElementById("modalOverlay").style.display = "block";
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
  closeUserModal();
  window.location.href = `payment.html?id=${selectedTrainId}&type=train&price=${selectedPrice}`;
});

function closeUserModal() {
  const modal = document.getElementById("userDetailsModal");
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
    document.getElementById("modalOverlay").style.display = "none";
  }, 300);
}