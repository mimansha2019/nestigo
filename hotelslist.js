let counts = {
  adults: 2,
  children: 0,
  room: 1
};

function updateCount(type, delta) {
  if (type === 'adults' && (counts.adults + delta >= 1)) {
    counts.adults += delta;
  } else if (type === 'children' && (counts.children + delta >= 0)) {
    counts.children += delta;
  } else if (type === 'room' && (counts.room + delta >= 1)) {
    counts.room += delta;
  }

  document.getElementById('adults-count').innerText = counts.adults;
  document.getElementById('children-count').innerText = counts.children;
  document.getElementById('room-count').innerText = counts.room;

  document.getElementById('selection-display').innerText = `${counts.adults} adult${counts.adults > 1 ? 's' : ''} · ${counts.room} room${counts.room > 1 ? 's' : ''}`;
}

function toggleDropdown() {
  const container = document.querySelector(".dropdown-container");
  const dropdown = document.getElementById("dropdown-box");

  const isOpen = dropdown.style.display === "block";
  dropdown.style.display = isOpen ? "none" : "block";
  container.classList.toggle("open", !isOpen);
}

function changeCount(type, change) {
  const countEl = document.getElementById(`${type}-count`);
  let count = parseInt(countEl.innerText);
  count += change;
  if (count < 0) count = 0;
  countEl.innerText = count;

  const adults = document.getElementById("adults-count").innerText;
  const rooms = document.getElementById("room-count").innerText;
  document.getElementById("dropdown-label").innerText = `${adults} adults · ${rooms} room`;
}

function updateBudget() {
  const slider = document.getElementById('budgetRange');
  document.getElementById('maxBudget').value = slider.value.toLocaleString('en-IN');
}

function initAutocomplete() {
  const input = document.getElementById('destination-input');
  if (!input) return;

  const options = { types: ['(cities)'] };
  const autocomplete = new google.maps.places.Autocomplete(input, options);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    console.log('Selected Place:', place);
  });
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : "";
}

function toggleBookingHistory() {
  const box = document.getElementById("booking-history-box");
  if (box) {
    box.style.display = box.style.display === "none" ? "flex" : "none";
  }
}

function logout() {
  localStorage.removeItem("authUser");
  window.location.href = "https://dev-srolq5coxmes27yo.us.auth0.com/v2/logout?returnTo=http://localhost:5500/index.html&client_id=1DwVF3ZMshLbYevAMGFb6hhEj0kIIdFE";
}

function downloadBookingPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Nestigo - Booking History", 20, 20);
  doc.setFontSize(12);

  let y = 40;
  const bookings = window._bookings || [];

  bookings.forEach((booking, index) => {
    doc.text(`${index + 1}. ${booking.destination}`, 20, y);
    doc.text(`Hotel: ${booking.hotel}`, 25, y + 10);
    doc.text(`Check-in: ${booking.checkin} | Check-out: ${booking.checkout}`, 25, y + 20);
    y += 35;
  });

  doc.save("booking-history.pdf");
}

window.addEventListener("DOMContentLoaded", () => {
  initAutocomplete();

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('dropdown-box');
    const container = document.querySelector('.dropdown-container');
    if (dropdown && container && !container.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });

  document.querySelector(".map-image")?.addEventListener("click", (e) => {
    e.preventDefault();
    const place = document.getElementById('searchInput').value || 'India';
    const query = encodeURIComponent(place);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapUrl, '_blank');
  });

  const destination = getCookie("destination");
  const searchBox = document.getElementById("destination-input");
  if (destination && searchBox) searchBox.value = destination;

  document.querySelector(".search-btn")?.addEventListener("click", async () => {
    const dest = document.getElementById("destination-input").value;
    const dates = document.querySelectorAll("input[type=date]");
    const checkin = dates[0].value;
    const checkout = dates[1].value;
    const resultsBox = document.getElementById("results");

    resultsBox.innerHTML = "<p>Searching Airbnb rentals...</p>";

    try {
      const res = await fetch("http://localhost:5000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "destination-input": dest,
          checkin_date: checkin,
          checkout_date: checkout
        })
      });

      const listings = await res.json();
      resultsBox.innerHTML = "";

      if (!Array.isArray(listings)) {
        resultsBox.innerHTML = `<p>Error: ${listings.error || "Unexpected server response"}</p>`;
        return;
      }

      if (listings.length === 0) {
        resultsBox.innerHTML = "<p>No rentals found.</p>";
        return;
      }

      listings.forEach(item => {
        const l = item.listing;
        const card = document.createElement("div");
        card.className = "hotel-card";

        const image = l.contextualPictures?.[0]?.picture || "https://via.placeholder.com/300x200";
        const price = l.priceSummary?.displayPrice || l.priceSummary?.priceItems?.[0]?.title || "Visit Airbnb";
        const listingId = l.id || l.listingId;
        const url = listingId ? `https://www.airbnb.com/rooms/${listingId}` : "#";
        const name = l.name || "No title";
        const city = l.city || "Unknown";

        card.innerHTML = `
          <div class="card-content">
            <h3>${name}</h3>
            <img src="${image}" alt="Hotel Image" style="width:100%; border-radius: 10px;" />
            <p>Location: ${city}</p>
            <p>Price: ${price}</p>
          </div>
          <div class="card-actions">
            <button class="airbnb-btn" onclick="window.open('${url}', '_blank')">View on Airbnb</button>
            <button class="book-btn" data-name="${name}" data-price="${price.replace(/[^0-9.]/g, '')}">Book Now</button>
          </div>
        `;

        resultsBox.appendChild(card);

        const bookBtn = card.querySelector(".book-btn");
        bookBtn?.addEventListener("click", async (event) => {
          const storedUser = JSON.parse(localStorage.getItem("authUser") || "{}");
          const userEmail = storedUser.email;
          const userName = storedUser.name || storedUser.nickname;
          const hotelName = event.target.dataset.name;
          const rawPrice = event.target.dataset.price;
          const amount = parseFloat(rawPrice) || 0;
          const destination = document.getElementById("destination-input").value;
          const checkin = document.getElementById("checkin").value;
          const checkout = document.getElementById("checkout").value;

          if (!userEmail || !hotelName || isNaN(amount)) {
            alert("⚠️ Please log in and select a valid hotel.");
            return;
          }

          try {
            await fetch("http://localhost:5000/save-booking", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: userEmail,
                name: userName,
                hotel: hotelName,
                destination,
                checkin,
                checkout
              })
            });

            const sessionRes = await fetch("http://localhost:5000/create-checkout-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ hotelName, amount, userEmail })
            });

            const sessionData = await sessionRes.json();
            if (sessionData.checkout_url) {
              window.location.href = sessionData.checkout_url;
            } else {
              alert("❌ Stripe checkout failed: " + sessionData.error);
            }
          } catch (err) {
            console.error("❌ Booking error:", err);
            alert("Something went wrong during booking.");
          }
        });
      });
    } catch (error) {
      console.error("Hotel fetch failed:", error);
      resultsBox.innerHTML = "<p>Server error. Check console.</p>";
    }
  });

  // Auth0 Profile Update
  const storedUser = localStorage.getItem("authUser");
  const signInBtn = document.getElementById("sign-in-btn");
  const signUpBtn = document.getElementById("sign-up-btn");
  const profileName = document.getElementById("profile-name");
  const profilePic = document.getElementById("profile-pic");
  const userProfile = document.getElementById("user-profile");
  const dropdownName = document.getElementById("dropdown-username");

  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (signInBtn) signInBtn.style.display = "none";
    if (signUpBtn) signUpBtn.style.display = "none";
    if (profileName) profileName.textContent = user.name || user.email;
    if (profilePic) profilePic.src = user.picture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
    if (userProfile) userProfile.style.display = "flex";
    if (dropdownName) dropdownName.textContent = user.name || user.email;
  }
});

// === Dropdown Toggle Logic ===
const profileButton = document.getElementById("profile-button");
const dropdownMenu = document.getElementById("dropdown-menu");
const userProfile = document.getElementById("user-profile");

if (profileButton && dropdownMenu && userProfile) {
  profileButton.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("show");
  });

  dropdownMenu.addEventListener("click", (event) => {
    event.stopPropagation(); // prevent auto-closing
  });

  document.addEventListener("click", (event) => {
    if (!userProfile.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });
}

const bookingList = document.getElementById("booking-list");
const storedUser = JSON.parse(localStorage.getItem("authUser") || "{}");

if (bookingList && storedUser.email) {
  fetch(`http://localhost:5000/get-bookings?email=${storedUser.email}`)
    .then(res => res.json())
    .then(bookings => {
      if (!Array.isArray(bookings)) {
        console.warn("Invalid bookings response:", bookings);
        return;
      }

      window._bookings = bookings; // For PDF use
      bookingList.innerHTML = "";

      bookings.forEach(booking => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${booking.destination}</strong><br/>
          Hotel: ${booking.hotel}<br/>
          Check-in: ${booking.checkin} | Check-out: ${booking.checkout}
        `;
        li.style.marginBottom = "10px";
        bookingList.appendChild(li);
      });
    })
    .catch(err => {
      console.error("❌ Failed to load bookings:", err);
    });
}
