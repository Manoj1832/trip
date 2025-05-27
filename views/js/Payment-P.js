
// Load booking data from localStorage
const bookingData = JSON.parse(localStorage.getItem("bookingData"));
if (bookingData) {
 document.getElementById("summary-name").textContent = bookingData.name || "";
 document.getElementById("summary-email").textContent = bookingData.email || "";
 document.getElementById("summary-destination").textContent = bookingData.destination || "";
 document.getElementById("summary-persons").textContent = bookingData.seats || "";
 document.getElementById("summary-price").textContent = bookingData.price || "";
} else {
 const summaryBox = document.getElementById("booking-summary");
 if (summaryBox) {
 summaryBox.innerHTML = "<p style='color: red;'>No booking data found.</p>";
 }
}


 const paymentForm = document.getElementById("payment-form");
 const otpContainer = document.getElementById("otp-container");
 const otpInput = document.getElementById("otp-input");
 const otpMessage = document.getElementById("otp-message");
 let generatedOTP = null;

 paymentForm.addEventListener("submit", function (e) {
 e.preventDefault();

 // Clear old errors
 const fields = ["card-name", "phone", "card-number", "cvv", "expiry"];
 fields.forEach(id => {
 const input = document.getElementById(id);
 input.classList.remove("error");
 const oldError = input.nextElementSibling;
 if (oldError && oldError.classList.contains("error-text")) {
 oldError.remove();
 }
 });

 let isValid = true;

 const name = document.getElementById("card-name");
 const phone = document.getElementById("phone");
 const number = document.getElementById("card-number");
 const expiry = document.getElementById("expiry");
 const cvv = document.getElementById("cvv");

 const nameRegex = /^[A-Za-z\s]+$/;
 const phoneRegex = /^\d{10}$/;
 const cardRegex = /^\d{16}$/;
 const cvvRegex = /^\d{3}$/;
 const expiryDate = new Date(expiry.value + "-01");
 const minDate = new Date("2025-12-31");

 function showError(input, message) {
 input.classList.add("error");
 const errorMsg = document.createElement("small");
 errorMsg.className = "error-text";
 errorMsg.textContent = message;
 input.insertAdjacentElement("afterend", errorMsg);
 isValid = false;
 }

 if (!nameRegex.test(name.value.trim())) {
 showError(name, "Only letters and spaces allowed.");
 }

 if (!phoneRegex.test(phone.value.trim())) {
 showError(phone, "Phone must be exactly 10 digits.");
 }

 if (!cardRegex.test(number.value.trim())) {
 showError(number, "Card number must be 16 digits.");
 }

 if (!cvvRegex.test(cvv.value.trim())) {
 showError(cvv, "CVV must be 3 digits.");
 }

 if (!expiry.value || expiryDate < minDate) {
 showError(expiry, "Expiry must be after December 2025.");
 }

 if (!isValid) return;

 // Generate OTP and show OTP container
 generatedOTP = Math.floor(1000 + Math.random() * 9000);
 alert("Your OTP is: " + generatedOTP);

 otpContainer.style.display = "block";
 otpInput.value = "";
 otpMessage.textContent = "";
 otpInput.focus();
 });

 const verifyBtn = document.getElementById("verify-btn");

 verifyBtn.addEventListener("click", () => {
 if (otpInput.value.trim() === "") {
 otpMessage.style.color = "red";
 otpMessage.textContent = "Please enter the OTP.";
 return;
 }
// Inside OTP verification block
if (otpInput.value.trim() == generatedOTP) {
  otpMessage.style.color = "green";
  otpMessage.textContent = "Payment verified successfully! ✅";

  // Get all booking and payment data
  const bookingData = JSON.parse(localStorage.getItem("bookingData"));
  const paymentData = {
    name: document.getElementById("card-name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    cardNumber: document.getElementById("card-number").value.trim(),
    cvv: document.getElementById("cvv").value.trim(),
    expiry: document.getElementById("expiry").value.trim(),
    otp: generatedOTP
  };

  const packageBooking = {
    ...bookingData,
    paymentInfo: paymentData,
    bookingDate: new Date().toISOString()
  };

  // Send data to backend
  fetch("http://localhost:5000/api/package-bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(packageBooking)
  })
  .then(res => res.json())
  .then(data => {
    console.log("Booking saved:", data);
    setTimeout(() => {
      paymentForm.reset();
      otpContainer.style.display = "none";
      otpMessage.textContent = "";
      alert("Payment completed!");
      window.location.href = "./feedback.html";
      //localStorage.removeItem("bookingData"); // clear old data
    }, 1200);
  })
  .catch(err => {
    console.error("Failed to save booking:", err);
    otpMessage.textContent = "Error saving booking. Please try again.";
    otpMessage.style.color = "red";
  });
} else {
  otpMessage.style.color = "red";
  otpMessage.textContent = "Incorrect OTP. Please try again.";
}

 });
