// Elements
const cardOption = document.getElementById("card-option");
const cardForm = document.getElementById("card-payment-form");
const paymentForm = document.getElementById("payment-form");
const sendOtpBtn = document.getElementById("send-otp-btn");
const verifyBtn = document.getElementById("verify-btn");
const otpContainer = document.getElementById("otp-container");
const otpInput = document.getElementById("otp");
const otpMsg = document.getElementById("otp-message");

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type"); // "flight" or "train"
const price = parseFloat(urlParams.get("price"));

// Session user details
const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
const seats = parseInt(userDetails?.seats || 1);

// Display user data
if (userDetails) {
  document.getElementById("passengerNameDisplay").textContent = `Name: ${userDetails.name}`;
  document.getElementById("passengerEmailDisplay").textContent = `Email: ${userDetails.email}`;
  document.getElementById("passengerAgeDisplay").textContent = `Age: ${userDetails.age}`;
  document.getElementById("passengerSeatsDisplay").textContent = `Seats: ${seats}`;
}

// Display booking type and price
document.getElementById("bookingType").textContent = type === "train" ? "Train Ticket" : "Flight Ticket";
document.getElementById("priceDisplay").textContent = `₹${price * seats}`;

// Fetch travel item details
if (id && type) {
  fetch(`http://localhost:5000/api/${type}s/${id}`)
    .then(res => res.json())
    .then(item => {
      document.getElementById("itemInfo").innerHTML = `
        <h3>${type === "flight" ? item.airline : item.trainName}</h3>
        <p>From: ${item.from} → To: ${item.to}</p>
        <p>Date: ${item.date}</p>
        <p>Departure: ${item.departureTime}, Arrival: ${item.arrivalTime}</p>
        <p>Price: ₹${item.price * seats}</p>
      `;
    })
    .catch(err => console.error("Failed to load booking details:", err));
}

// Show card form on option click
cardOption.addEventListener("click", () => {
  cardForm.style.display = "block";
  cardForm.scrollIntoView({ behavior: "smooth" });
});

// Send OTP Handler
let phoneNumber = "";

paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  otpMsg.textContent = "";

  // Input values
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const card = document.getElementById("card");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");

  // Validation regex
  const regex = {
    name: /^[A-Za-z\s]+$/,
    phone: /^\d{10}$/,
    card: /^\d{16}$/,
    cvv: /^\d{3}$/,
  };

  let valid = true;

  // Clear previous errors
  [name, phone, card, expiry, cvv].forEach((input) => {
    input.classList.remove("error");
    const next = input.nextElementSibling;
    if (next && next.classList.contains("error-text")) next.remove();
  });

  function showError(input, msg) {
    const error = document.createElement("small");
    error.className = "error-text";
    error.textContent = msg;
    input.classList.add("error");
    input.insertAdjacentElement("afterend", error);
    valid = false;
  }

  // Validation checks
  if (!regex.name.test(name.value.trim())) showError(name, "Invalid name");
  if (!regex.phone.test(phone.value.trim())) showError(phone, "Invalid phone number");
  if (!regex.card.test(card.value.trim())) showError(card, "Card must be 16 digits");
  if (!regex.cvv.test(cvv.value.trim())) showError(cvv, "CVV must be 3 digits");

  // Expiry date check
  const today = new Date();
  const [year, month] = expiry.value.split("-").map(Number);
  const expiryDate = new Date(year, month - 1);
  if (!expiry.value || expiryDate < today) showError(expiry, "Card expiry must be in the future");

  if (!valid) return;

  phoneNumber = phone.value.trim();

  // Send OTP request
  try {
    const response = await fetch("http://localhost:5000/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber }),
    });

    const data = await response.json();
    if (response.ok) {
      otpContainer.style.display = "block";
      otpMsg.style.color = "green";
      otpMsg.textContent = "✅ OTP sent to your phone!";
    } else {
      otpMsg.style.color = "red";
      otpMsg.textContent = "❌ " + data.message;
    }
  } catch (err) {
    console.error("OTP send error:", err);
    otpMsg.style.color = "red";
    otpMsg.textContent = "❌ Failed to send OTP.";
  }
});

// Verify OTP and confirm booking
verifyBtn.addEventListener("click", async () => {
  const enteredOTP = otpInput.value.trim();
  if (!/^\d{4,6}$/.test(enteredOTP)) {
    otpMsg.style.color = "red";
    otpMsg.textContent = "Invalid OTP format.";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber, otp: enteredOTP }),
    });

    const data = await response.json();

    if (data.success) {
      otpMsg.style.color = "green";
      otpMsg.textContent = "✅ OTP verified! Booking confirmed.";

      setTimeout(() => completeBooking(), 1000);
    } else {
      otpMsg.style.color = "red";
      otpMsg.textContent = "❌ " + data.message;
    }
  } catch (err) {
    console.error("OTP verification error:", err);
    otpMsg.style.color = "red";
    otpMsg.textContent = "❌ OTP verification failed.";
  }
});

// Complete Booking
async function completeBooking() {
  const txnId = "TXN" + Date.now();
  const totalAmount = price * seats;

  const bookingUrl = `http://localhost:5000/api/${type}-bookings`;
  const bookingBody = {
    [`${type}Id`]: id,
    name: userDetails.name,
    email: userDetails.email,
    seats: seats,
  };

  try {
    const bookingResponse = await fetch(bookingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingBody),
    });

    const bookingData = await bookingResponse.json();
    console.log("Booking response:", bookingData); // ✅ DEBUG HERE

    if (bookingResponse.ok && bookingData.bookingId) {
      localStorage.setItem("txnId", txnId);
      localStorage.setItem("amount", totalAmount);
      localStorage.setItem("bookingId", bookingData.bookingId);

      alert("✅ Payment & Booking Successful!");

      // ✅ Final Redirect
      window.location.href = `booking-summary.html?type=${type}&id=${bookingData.bookingId}`;
    } else {
      alert("❌ Booking failed: " + (bookingData.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Booking error:", error);
    alert("❌ Booking failed due to a server error.");
  }
}

// Close Modal (if shown)
function closeModal() {
  const modal = document.getElementById("userDetailsModal");
  const overlay = document.getElementById("modalOverlay");
  if (modal) modal.style.display = "none";
  if (overlay) overlay.style.display = "none";
}
