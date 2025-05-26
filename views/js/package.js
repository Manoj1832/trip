document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("destinations-container");

  try {
    const res = await fetch('http://localhost:5000/api/popular-destinations');
    const destinations = await res.json();

    if (!Array.isArray(destinations) || destinations.length === 0) {
      container.innerHTML = "<p class='text-muted text-center'>No destinations found.</p>";
      return;
    }

    destinations.forEach(dest => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";

      col.innerHTML = `
        <div class="card h-100">
          <img src="${dest.thumbnail || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${dest.title}">
          <div class="card-body">
            <h5 class="card-title">${dest.title}</h5>
            <p class="card-text">${dest.description || 'No description available.'}</p>
            ${dest.flight_price ? `<p><strong>Flight:</strong> ${dest.flight_price}</p>` : ""}
            ${dest.hotel_price ? `<p><strong>Hotel:</strong> ${dest.hotel_price}</p>` : ""}
          </div>
          <div class="card-footer text-center">
            <a href="${dest.link}" target="_blank" class="btn btn-primary">Explore</a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  } catch (err) {
    console.error("Error loading destinations:", err);
    container.innerHTML = "<p class='text-danger text-center'>Failed to load destinations.</p>";
  }
});
