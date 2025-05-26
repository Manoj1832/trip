
    lucide.createIcons();

    function manageUsers() {
      alert("Redirecting to Manage Users...");
    }

    function manageReports() {
      alert("Redirecting to Manage Reports...");
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

      const headers = [["ID", "Name", "Status", "Registered"]];
      const data = [
        ["001", "Alice Smith", "Active", "2024-11-21"],
        ["002", "Bob Johnson", "Pending", "2024-12-03"],
        ["003", "Carol King", "Active", "2025-01-15"]
      ];

      let startY = 60;
      headers.concat(data).forEach((row, i) => {
        row.forEach((cell, j) => {
          doc.text(cell, 20 + j * 40, startY + i * 10);
        });
      });

      doc.save("admin-report.pdf");
    }
