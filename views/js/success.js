// success.js
const txn = localStorage.getItem("txnId") || "N/A";
const amt = localStorage.getItem("amount") || "0";

// Format amount
const formattedAmt = Number(amt).toLocaleString('en-IN');

// Display on page
document.getElementById("txnId").textContent = "Transaction ID: " + txn;
document.getElementById("amount").textContent = "Amount Paid: ₹" + formattedAmt;

// Optional: Clear localStorage
localStorage.removeItem("txnId");
localStorage.removeItem("amount");
