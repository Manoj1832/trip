
  document.getElementById('packageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('packageTitle').value;
    const destination = document.getElementById('packageDestination').value;
    const price = document.getElementById('packagePrice').value;
    console.log('Add Package:', { title, destination, price });
    // TODO: POST to backend
    $('#addPackageModal').modal('hide');
  });

  document.getElementById('userForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    console.log('Add User:', { name, email });
    // TODO: POST to backend
    $('#addUserModal').modal('hide');
  });

  function generateReport() {
    const type = document.getElementById('reportType').value;
    console.log('Generate report of type:', type);
    document.getElementById('reportResult').innerHTML = `<div class='alert alert-info'>Report for <b>${type}</b> generated.</div>`;
    // TODO: fetch actual report data
  }
