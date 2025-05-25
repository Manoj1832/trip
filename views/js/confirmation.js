
    let generatedOTP;
    // Fetch booking details and populate dynamically
    async function loadBookingDetails() {
      const email = localStorage.getItem("userEmail");
      const totalPrice  = localStorage.getItem('totalPrice');
      if (!email) return alert("User not logged in.");
      try {
        const response = await fetch(`http://localhost:5000/api/bookings?name=${email}`);
        const bookings = await response.json();
        const latestBooking = bookings[bookings.length - 1];

        // Set booking details to the page
        document.getElementById("userName").textContent = latestBooking.name;
        document.getElementById("userEmail").textContent = latestBooking.email;
        document.getElementById("destination").textContent = latestBooking.destination;
        document.getElementById("departureDate").textContent = latestBooking.departureDate;
        document.getElementById("arrivalDate").textContent = latestBooking.arrivalDate;
        document.getElementById("travelers").textContent = latestBooking.travelers;
        document.getElementById("totalPrice").textContent = latestBooking.totalPrice;
      } catch (err) {
        console.error("Error loading booking details:", err);
      }
    }

    function sendOTP() {
      const mobile = document.getElementById("mobileNumber").value;
      if (mobile) {
        generatedOTP = Math.floor(100000 + Math.random() * 900000);
        alert("OTP Sent: " + generatedOTP);
        document.getElementById("otpSection").style.display = "block";
      } else {
        alert("Please enter your mobile number");
      }
    }

    function verifyOTP() {
      const enteredOTP = document.getElementById("otp").value;
      const message = document.getElementById("message");
      if (enteredOTP == generatedOTP) {
        message.textContent = "OTP Verified!";
        message.style.color = "green";
        document.getElementById("payButton").style.display = "block";
      } else {
        message.textContent = "Invalid OTP.";
        message.style.color = "red";
      }
    }

    async function processPayment() {
      const card = document.getElementById("cardNumber").value;
      const expiry = document.getElementById("expiryDate").value;
      const cvv = document.getElementById("cvv").value;

      if (!/^\d{16}$/.test(card)) return alert("Card number must be 16 digits.");
      if (!/^\d{3}$/.test(cvv)) return alert("CVV must be 3 digits.");
      if (!/^\d{2}\/\d{2}$/.test(expiry)) return alert("Expiry must be MM/YY format.");

      const [mm, yy] = expiry.split("/").map(Number);
      const expiryDate = new Date(2000 + yy, mm);
      const now = new Date();
      if (expiryDate <= now) return alert("Card has expired.");

      const email = localStorage.getItem("userEmail");
      
      try {
        const response = await fetch(`http://localhost:5000/api/bookings?name=${email}`);
        const bookings = await response.json();
        const latest = bookings[bookings.length - 1];
        const amount = latest.totalPrice;

        const txnId = "TXN" + Math.floor(100000 + Math.random() * 900000);
        await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, amount, transactionId: txnId })
        });

        showSuccess(txnId, amount);
         window.location.href='success.html'
      } catch (err) {
        window.location.href='success.html'
        console.error(err);
      }
    }

    function showSuccess(txnId, amount) {
      document.getElementById("loadingScreen").style.display = "flex";
      setTimeout(() => {
        window.location.href = `success.html?txn=${txnId}&amt=${amount}`;
      }, 3000);
    }

    function redirectToPayment(method) {
      const urls = {
        paypal: "https://www.paypal.com",
        googlepay: "https://pay.google.com",
        applepay: "https://www.apple.com/apple-pay/",
        stripe: "https://www.stripe.com"
      };
      window.location.href = urls[method] || "#";
    }

    function walletPayment() {
      const walletBalance = 500;
      const cost = 300;
      if (walletBalance >= cost) {
        const txnId = "TXN" + Math.floor(100000 + Math.random() * 900000);
        showSuccess(txnId, cost);
      } else {
        alert("Insufficient wallet balance");
      }
    }

    // Load booking details on page load
    loadBookingDetails();

    document.getElementById("submitBtn").addEventListener("click", async function () {
  const mobileNumber = document.getElementById("mobileNumber").value.trim();
  const cardNumber = document.getElementById("cardNumber").value.trim();
  const expiryDate = document.getElementById("expiryDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  const data = {
    mobileNumber,
    cardNumber,
    expiryDate,
    cvv,
  };

  try {
    const response = await fetch("http://localhost:5000/api/confirm-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    window.location.href = 'success.html'
    alert(result.message);
  } catch (error) {
    alert("Error: " + error.message);
  }
});
