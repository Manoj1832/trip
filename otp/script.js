document.getElementById('send-otp').addEventListener('click', async () => {
  const phone = document.getElementById('phone').value;
  if (!phone) {
    alert('Please enter your phone number');
    return;
  }

  const response = await fetch('/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });

  const result = await response.json();
  document.getElementById('message').innerText = result.message;
});

document.getElementById('verify-otp').addEventListener('click', async () => {
  const phone = document.getElementById('phone').value;
  const otp = document.getElementById('otp').value;
  if (!otp) {
    alert('Please enter the OTP');
    return;
  }

  const response = await fetch('/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp })
  });

  const result = await response.json();
  document.getElementById('message').innerText = result.message;
});
