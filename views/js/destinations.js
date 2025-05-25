let allDestinations = []; // To store all loaded destinations
let filteredDestinations = []; // To store filtered/sorted results
let currentPage = 1;
const itemsPerPage = 6;

// Load all destinations once and store globally
async function loadDestinations() {
  try {
    const response = await fetch('http://localhost:5000/api/destinations');
    const data = await response.json();
    allDestinations = data;
    filteredDestinations = allDestinations; // initially no filter
    currentPage = 1;
    renderDestinationsPage();
  } catch (err) {
    console.error('Failed to load destinations:', err);
  }
}

// Render destinations for current page
function renderDestinationsPage() {
  const container = document.getElementById('destination-container');
  container.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredDestinations.slice(start, end);

  if (pageItems.length === 0 && currentPage > 1) {
    // No more items, disable load more button
    document.getElementById('loadMoreBtn').disabled = true;
    return;
  } else {
    document.getElementById('loadMoreBtn').disabled = false;
  }

  pageItems.forEach(dest => {
    const card = document.createElement('div');
    card.classList.add('destination-card');
    card.innerHTML = `
      <img src="${dest.image}" alt="${dest.name}" />
      <h3>${dest.name}</h3>
      <p>${dest.description}</p>
      <p><strong>Rating:</strong> ${dest.rating} ⭐ (${dest.reviews} reviews)</p>
      <p><strong>Price:</strong> ₹${dest.price || 'N/A'}</p>
    `;
    container.appendChild(card);
  });

  // Hide Load More if no more items after current page
  if (end >= filteredDestinations.length) {
    document.getElementById('loadMoreBtn').style.display = 'none';
  } else {
    document.getElementById('loadMoreBtn').style.display = 'block';
  }
}

// Load dropdown options for 'From' and 'To'
async function loadDropdowns() {
  try {
    const response = await fetch('http://localhost:5000/api/destinations/names');
    const data = await response.json();

    const fromSelect = document.getElementById('fromSelect');
    const toSelect = document.getElementById('toSelect');

    fromSelect.innerHTML = '<option value="">From</option>';
    toSelect.innerHTML = '<option value="">To</option>';

    data.forEach(dest => {
      const optionFrom = document.createElement('option');
      optionFrom.value = dest.name;
      optionFrom.textContent = dest.name;
      fromSelect.appendChild(optionFrom);

      const optionTo = document.createElement('option');
      optionTo.value = dest.name;
      optionTo.textContent = dest.name;
      toSelect.appendChild(optionTo);
    });
  } catch (err) {
    console.error('Error loading dropdowns:', err);
  }
}

// Suggest destinations excluding 'from' and 'to'
async function suggestDestinations(from, to) {
  try {
    const response = await fetch(`http://localhost:5000/api/destinations/suggest?from=${from}&to=${to}`);
    const suggestions = await response.json();

    const suggestBox = document.getElementById('suggestion-box');
    const suggestionsList = document.getElementById('suggestions-list');

    suggestionsList.innerHTML = ''; // Clear previous suggestions
    suggestBox.hidden = false;

    if (suggestions.length === 0) {
      suggestionsList.innerHTML = '<p>No suggestions available.</p>';
      return;
    }

    suggestions.forEach(place => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${place.name}</strong>: ${place.description}`;
      suggestionsList.appendChild(div);
    });
  } catch (err) {
    console.error('Suggestion failed:', err);
  }
}

// Trigger when dropdown changes
function handleLocationChange() {
  const from = document.getElementById('fromSelect').value;
  const to = document.getElementById('toSelect').value;

  if (from && to && from !== to) {
    suggestDestinations(from, to);
  }
}

// Filter, search and sort combined
function filterSortDestinations() {
  const searchQuery = document.getElementById('searchBar').value.toLowerCase();
  const sortBy = document.getElementById('sortSelect').value;

  // Filter by search text on name
  filteredDestinations = allDestinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery)
  );

  // Sort results
  if (sortBy === 'price') {
    filteredDestinations.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
  } else if (sortBy === 'rating') {
    filteredDestinations.sort((a, b) => b.rating - a.rating);
  }

  currentPage = 1;
  renderDestinationsPage();
}

// Load more button clicked
function loadMore() {
  currentPage++;
  renderDestinationsPage();
}

// Event listeners
document.getElementById('fromSelect').addEventListener('change', handleLocationChange);
document.getElementById('toSelect').addEventListener('change', handleLocationChange);
document.getElementById('searchBar').addEventListener('input', filterSortDestinations);
document.getElementById('sortSelect').addEventListener('change', filterSortDestinations);
document.getElementById('loadMoreBtn').addEventListener('click', loadMore);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  loadDropdowns();
  loadDestinations();
});
