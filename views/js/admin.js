    async function loadUsers() {
      const res = await fetch('http://localhost:5000/api/users');
      const users = await res.json();
      const tbody = document.getElementById("user-table-body");
      tbody.innerHTML = "";
      users.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${String(index + 1).padStart(3, '0')}</td>
          <td>${user.name}</td>
          <td><span class="badge active">Active</span></td>
          <td>${new Date().toISOString().split('T')[0]}</td>
        `;
        tbody.appendChild(row);
      });
    }

    async function addPackage(event) {
      event.preventDefault();
      const body = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        flight_price: document.getElementById("flight_price").value,
        extracted_flight_price: +document.getElementById("extracted_flight_price").value,
        hotel_price: document.getElementById("hotel_price").value,
        extracted_hotel_price: +document.getElementById("extracted_hotel_price").value,
        thumbnail: document.getElementById("thumbnail").value
      };

      const res = await fetch('http://localhost:5000/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert("Package added successfully!");
        document.getElementById("add-package-form").reset();
      } else {
        alert("Failed to add package.");
      }
    }

    function generatePDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Admin Report", 20, 20);
      doc.setFontSize(12);
      doc.text("Generated on: " + new Date().toLocaleString(), 20, 30);
      doc.setFontSize(14);
      doc.text("User Summary", 20, 50);
      const rows = Array.from(document.querySelectorAll("#user-table-body tr")).map(row =>
        Array.from(row.children).map(cell => cell.innerText)
      );
      rows.forEach((row, i) => {
        row.forEach((cell, j) => {
          doc.text(cell, 20 + j * 40, 60 + i * 10);
        });
      });
      doc.save("admin-report.pdf");
    }

    function manageUsers() {
      loadUsers();
    }

    window.onload = () => {
      lucide.createIcons();
      loadUsers();
    };