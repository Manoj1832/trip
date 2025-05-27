
    const packages = [
      {
        destination: "Goa",
        transport: "Flight",
        hotel: "Taj Exotica",
        nights: 4,
        price: "₹10,000",
        description: "Relax on pristine beaches, enjoy water sports, and experience vibrant nightlife.",
        itinerary: [
          "Day 1: Arrival and beachside relaxation at Benaulim Beach.",
          "Day 2: North Goa sightseeing – Aguada Fort, Baga Beach.",
          "Day 3: Watersports and local seafood tasting.",
          "Day 4: Shopping and departure."
        ]
      },
      {
        destination: "Manali, Himachal Pradesh",
        transport: "Bus",
        hotel: "Snow Valley Resorts",
        nights: 5,
        price: "₹8,000",
        description: "Snowy peaks, serene landscapes, and thrilling adventure activities await you.",
        itinerary: [
          "Day 1: Arrival and check-in. Local market walk.",
          "Day 2: Solang Valley adventure sports.",
          "Day 3: Rohtang Pass snow trip.",
          "Day 4: Hadimba Temple and old Manali cafe tour.",
          "Day 5: Departure."
        ]
      },
      {
        destination: "Udaipur, Rajasthan",
        transport: "Train",
        hotel: "The Leela Palace",
        nights: 3,
        price: "₹5,000",
        description: "City of Lakes with royal palaces, romantic boat rides, and historic forts.",
        itinerary: [
          "Day 1: Lake Pichola boat ride and dinner.",
          "Day 2: Visit City Palace, Jagdish Temple, and local bazaars.",
          "Day 3: Sajjangarh Fort and departure."
        ]
      },
      {
        destination: "Darjeeling, West Bengal",
        transport: "Train",
        hotel: "Mayfair Hotel",
        nights: 4,
        price: "₹3,000",
        description: "Scenic hill station known for tea gardens, toy train, and Kanchenjunga views.",
        itinerary: [
          "Day 1: Arrival and tea estate tour.",
          "Day 2: Tiger Hill sunrise, Batasia Loop, Ghoom Monastery.",
          "Day 3: Darjeeling Zoo, Himalayan Mountaineering Institute.",
          "Day 4: Mall Road shopping and departure."
        ]
      },
      {
        destination: "Kochi, Kerala",
        transport: "Flight",
        hotel: "Brunton Boatyard",
        nights: 3,
        price: "₹2,000",
        description: "Blend of colonial charm and serene backwaters with traditional Kerala experiences.",
        itinerary: [
          "Day 1: Arrival and Fort Kochi walk.",
          "Day 2: Backwater cruise and Kathakali show.",
          "Day 3: Dutch Palace, Jewish Synagogue, shopping at Lulu Mall."
        ]
      },
      {
        destination: "Rishikesh, Uttarakhand",
        transport: "Bus",
        hotel: "Ganga Kinare",
        nights: 3,
        price: "₹4,000",
        description: "Spiritual haven with yoga, adventure sports, and Ganga aarti experiences.",
        itinerary: [
          "Day 1: Arrival, Ganga aarti at Triveni Ghat.",
          "Day 2: River rafting and yoga session.",
          "Day 3: Neelkanth Temple and departure."
        ]
      },
      {
        destination: "Ooty, Tamil Nadu",
        transport: "Train",
        hotel: "Savoy IHCL",
        nights: 4,
        price: "₹2,500",
        description: "Charming hill town with botanical gardens, lakes, and misty mountains.",
        itinerary: [
          "Day 1: Arrival and leisure evening.",
          "Day 2: Botanical Garden, Rose Garden, and Lake boating.",
          "Day 3: Nilgiri train ride to Coonoor.",
          "Day 4: Local shopping and departure."
        ]
      },
      {
        destination: "Mysuru, Karnataka",
        transport: "Train",
        hotel: "Radisson Blu",
        nights: 3,
        price: "₹2,000",
        description: "Palace city offering regal heritage, yoga, and local markets.",
        itinerary: [
          "Day 1: Arrival and Mysore Palace visit.",
          "Day 2: Chamundi Hills and Brindavan Garden.",
          "Day 3: Silk saree shopping and departure."
        ]
      },
      {
        destination: "Shillong, Meghalaya",
        transport: "Flight",
        hotel: "Polo Towers",
        nights: 4,
        price: "₹3,000",
        description: "Scenic beauty, waterfalls, and the cultural vibrance of Northeast India.",
        itinerary: [
          "Day 1: Arrival and Ward's Lake walk.",
          "Day 2: Shillong Peak, Elephant Falls.",
          "Day 3: Day trip to Cherrapunji caves and Seven Sisters Waterfalls.",
          "Day 4: Return journey."
        ]
      },
      {
        destination: "Agra, Uttar Pradesh",
        transport: "Train",
        hotel: "ITC Mughal",
        nights: 2,
        price: "₹8,000",
        description: "Witness the grandeur of the Taj Mahal and Mughal architecture.",
        itinerary: [
          "Day 1: Arrival and visit to Agra Fort.",
          "Day 2: Early morning Taj Mahal tour, Mehtab Bagh view, departure."
        ]
      }
    ];

    const container = document.getElementById("packageContainer");

    packages.forEach(pkg => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${pkg.destination}</h3>
        <span class="badge">${pkg.transport}</span>
        <p><strong>Hotel:</strong> ${pkg.hotel}</p>
        <p><strong>Nights:</strong> ${pkg.nights}</p>
        <p class="price">${pkg.price}</p>
        <p class="description">${pkg.description}</p>
        <div class="itinerary">
          <h4>Itinerary</h4>
          <ul>${pkg.itinerary.map(i => `<li>${i}</li>`).join("")}</ul>
        </div>
        <button class="btn" onclick="bookPackage('${pkg.destination}', '${pkg.price}')">Book Now</button>
      `;
      container.appendChild(card);
    });

    let selectedPackage = null;

    function bookPackage(destination, price) {
      selectedPackage = { destination, price };
      document.getElementById("bookingModal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("bookingModal").style.display = "none";
      selectedPackage = null;
    }

    function confirmBooking() {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const age = document.getElementById("age").value.trim();
      const seats = parseInt(document.getElementById("seats").value);

      if (!name || !email || !age || isNaN(seats) || seats < 1) {
        alert("Please fill out all fields correctly.");
        return;
      }

      const unitPrice = parseInt(selectedPackage.price.replace(/[^\d]/g, ""));
      const totalPrice = unitPrice * seats;

      localStorage.setItem("bookingDetails", JSON.stringify({
        name, email, age, seats,
        destination: selectedPackage.destination,
        unitPrice, totalPrice
      }));

      window.location.href = "pay.html";
    }
