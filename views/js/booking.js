// Helper: Get query parameter from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const destinations = [
    { name: "Taj Mahal, Agra", description: "One of the Seven Wonders of the World, a symbol of love and Indian heritage.", image: "assets/tajmahal.jpg", basePricePerDay: 500, rating: 4.9, reviews: 200 },
    { name: "Goa Beaches", description: "Famous for its scenic beaches and vibrant nightlife.", image: "assets/goa.jpg.webp", basePricePerDay: 350, rating: 4.7, reviews: 300 },
    { name: "Mysore Palace", description: "A majestic palace with stunning architecture and rich history.", image: "assets/mysorepalace.jpg", basePricePerDay: 450, rating: 4.8, reviews: 150 },
    { name: "Himalayan Trekking (Manali)", description: "Explore the beautiful mountains of the Himalayas in Manali.", image: "assets/himalaiyantreeking.jpeg", basePricePerDay: 650, rating: 4.6, reviews: 120 },
    { name: "Jaipur, Rajasthan", description: "Known as the Pink City, with historical forts and palaces.", image: "assets/jaipur.jpg", basePricePerDay: 400, rating: 4.5, reviews: 200 },
    { name: "Kerala Backwaters", description: "Peaceful boat rides through Kerala's famous backwaters.", image: "assets/kerala.jpg", basePricePerDay: 420, rating: 4.7, reviews: 180 },
    { name: "Delhi, India", description: "Capital city known for its history, culture, and vibrant streets.", image: "assets/delhi.webp", basePricePerDay: 380, rating: 4.6, reviews: 250 },
    { name: "Mumbai, India", description: "The financial hub with rich history and a bustling nightlife.", image: "assets/mumbai.jpg", basePricePerDay: 390, rating: 4.4, reviews: 300 },
    { name: "Andaman Islands", description: "Tropical paradise with crystal clear waters, coral reefs, and beaches.", image: "assets/andaman.jpg", basePricePerDay: 700, rating: 4.8, reviews: 150 },
    { name: "Darjeeling, West Bengal", description: "Known for tea plantations and the breathtaking views of Kanchenjunga.", image: "assets/darjeeling.jpg", basePricePerDay: 410, rating: 4.7, reviews: 170 },
    { name: "Khajuraho, Madhya Pradesh", description: "Famous for its ancient temples and erotic sculptures.", image: "assets/khajuraho.jpg", basePricePerDay: 430, rating: 4.5, reviews: 100 },
    { name: "Sundarbans, West Bengal", description: "World’s largest mangrove forest and home to the Bengal tiger.", image: "assets/sundarbans.jpg", basePricePerDay: 470, rating: 4.6, reviews: 130 },
    { name: "Nainital, Uttarakhand", description: "A beautiful hill station surrounded by lakes and hills.", image: "assets/nainital.jpg", basePricePerDay: 390, rating: 4.5, reviews: 200 },
    { name: "Rishikesh, Uttarakhand", description: "Yoga capital of the world, famous for rafting and spiritual retreats.", image: "assets/rishikesh.jpg", basePricePerDay: 360, rating: 4.7, reviews: 150 },
    { name: "Udaipur, Rajasthan", description: "City of lakes, known for its palaces and romantic atmosphere.", image: "assets/udaipur.jpg", basePricePerDay: 440, rating: 4.6, reviews: 220 },
    { name: "Leh Ladakh", description: "A high-altitude desert with stunning landscapes and monasteries.", image: "assets/leh.jpg", basePricePerDay: 750, rating: 4.9, reviews: 300 },
    { name: "Amritsar, Punjab", description: "Home to the Golden Temple, a major spiritual site for Sikhs.", image: "assets/amritsar.jpg", basePricePerDay: 400, rating: 4.8, reviews: 200 },
    { name: "Varanasi, Uttar Pradesh", description: "One of the oldest living cities in the world, famous for its ghats.", image: "assets/varanasi.jpg", basePricePerDay: 390, rating: 4.5, reviews: 250 },
    { name: "Ranthambore National Park, Rajasthan", description: "Famous for wildlife safaris and sightings of the Bengal tiger.", image: "assets/ranthambore.jpg", basePricePerDay: 480, rating: 4.7, reviews: 130 },
    { name: "Kochi, Kerala", description: "A charming blend of colonial architecture, beaches, and spice markets.", image: "assets/kochi.jpg", basePricePerDay: 420, rating: 4.6, reviews: 180 },
    { name: "Ajanta Caves, Maharashtra", description: "Ancient rock-cut Buddhist cave complexes with exquisite murals.", image: "assets/ajanta.jpg", basePricePerDay: 460, rating: 4.7, reviews: 160 }
];

window.addEventListener('load', updatePrice);

// Load destination from localStorage or query parameter
let destination = JSON.parse(localStorage.getItem('destination'));
if (!destination) {
    const destinationName = decodeURIComponent(getQueryParam('destination') || '');
    destination = destinations.find(dest => dest.name === destinationName);
}

// Validate destination
if (!destination) {
    alert("Destination not found!");
    throw new Error("Destination not found.");
}

// Display destination details
const destinationDetails = document.getElementById('destinationDetails');
destinationDetails.innerHTML = `
    <h2>${destination.name}</h2>
    <img src="${destination.image}" alt="${destination.name}" />
    <p>${destination.description}</p>
`;

// Listen for inputs to recalculate price
document.getElementById('departureDate').addEventListener('change', updatePrice);
document.getElementById('arrivalDate').addEventListener('change', updatePrice);
document.getElementById('numTravelers').addEventListener('input', updatePrice);

function updatePrice() {
    const departureDate = document.getElementById('departureDate').value;
    const arrivalDate = document.getElementById('arrivalDate').value;
    const numTravelers = parseInt(document.getElementById('numTravelers').value);

    const priceElement = document.getElementById('price');

    if (!departureDate || !arrivalDate || isNaN(numTravelers) || numTravelers <= 0) {
        priceElement.innerText = 'Price: ₹0';
        return;
    }

    const depDate = new Date(departureDate);
    const arrDate = new Date(arrivalDate);

    // Ensure arrival is after departure
    if (arrDate <= depDate) {
        priceElement.innerText = 'Price: ₹0';
        return;
    }

    const days = Math.ceil((arrDate - depDate) / (1000 * 60 * 60 * 24));
    const basePrice = destination.basePricePerDay * days * numTravelers;
    priceElement.innerText = `Price: ₹${basePrice}`;
}

// Utility to calculate number of days
function calculateDays(departureDate, arrivalDate) {
    const depDate = new Date(departureDate);
    const arrDate = new Date(arrivalDate);
    const timeDiff = arrDate - depDate;
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return days > 0 ? days : 1;
}

// Handle Confirm Booking
document.getElementById('confirmBooking').addEventListener('click', async function () {
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const numTravelers = parseInt(document.getElementById('numTravelers').value);
    const departureDate = document.getElementById('departureDate').value;
    const arrivalDate = document.getElementById('arrivalDate').value;
    const priceText = document.getElementById('price').textContent.replace('Price: ₹', '');
    const totalPrice = parseFloat(priceText);

    if (!userName || !userEmail || !departureDate || !arrivalDate || isNaN(numTravelers)) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Prevent submission if price calculation failed
    if (isNaN(totalPrice) || totalPrice <= 0) {
        alert('Invalid total price.');
        return;
    }

    const bookingData = {
        name: userName,
        email: userEmail,
        destination: destination.name,
        departureDate,
arrivalDate,
travelers: numTravelers,
totalPrice
};
try {
    const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('bookingName', userName); // Save name for payment page
        localStorage.setItem('userEmail',userEmail);
        localStorage.setItem('bookingData',JSON.stringify(bookingData))
        window.location.href = 'payment.html';
    } else {
        alert('Booking failed: ' + result.message);
    }
} catch (error) {
}
});

