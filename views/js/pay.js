
    const booking = JSON.parse(localStorage.getItem("bookingDetails"));

    if (booking) {
      document.getElementById("name").textContent = `Name: ${booking.name}`;
      document.getElementById("email").textContent = `Email: ${booking.email}`;
      document.getElementById("age").textContent = `Age: ${booking.age}`;
      document.getElementById("destination").textContent = `Destination: ${booking.destination}`;
      document.getElementById("seats").textContent = `Number of Persons: ${booking.seats}`;
      document.getElementById("unitPrice").textContent = `Price per Person: ₹${booking.unitPrice}`;
      document.getElementById("totalPrice").textContent = `Total Price: ₹${booking.totalPrice}`;
    } else {
      document.body.innerHTML = "<h3>No booking details found.</h3>";
    }

    function goToPayment() {
  if (booking) {
    const paymentData = {
      name: booking.name,
      email: booking.email,
      phone: booking.phone || "", // add phone if available
      destination: booking.destination,
      checkin: booking.checkin || "", // optional fields if needed
      checkout: booking.checkout || "",
      persons: booking.seats,
      price: booking.totalPrice
    };
    localStorage.setItem("bookingData", JSON.stringify(paymentData));
  }
  window.location.href = "payment.html";
}

