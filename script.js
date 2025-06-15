const match = document.cookie.match(/(?:^| )destination=([^;]*)/);
const destination = match ? decodeURIComponent(match[1]) : "";


// Dropdown Toggle
    document.querySelectorAll('.dropdown .btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const menu = btn.nextElementSibling;
        menu.classList.toggle('show');
      });
    });

    // Close dropdowns if clicked outside
    window.addEventListener('click', (e) => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (!menu.previousElementSibling.contains(e.target)) {
          menu.classList.remove('show');
        }
      });
    });

    document.addEventListener('DOMContentLoaded', function() {
            const destinations = [
    {
      title: "Singapore",
      subtitle: "THE LION CITY",
      image: "https://images.unsplash.com/photo-1555217851-6141535bd771?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Maldives",
      subtitle: "CREATE MEMORIES IN",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Europe",
      subtitle: "EXPLORE THE CONTINENT",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Bali",
      subtitle: "TROPICAL ESCAPE",
      image: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      title: "Dubai",
      subtitle: "THE CITY OF LIFE",
      image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  ];

  const cardsContainer = document.getElementById("cardsContainer");

  const repeatCount = 3;
  const fullList = Array(repeatCount).fill(destinations).flat();

  fullList.forEach(dest => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(${dest.image}?auto=compress&cs=tinysrgb&w=800)`;
    card.innerHTML = `
      <div class="card-content">
        <h3>${dest.title}</h3>
        <p>${dest.subtitle}</p>
      </div>
    `;
    cardsContainer.appendChild(card);
  });      

           

            // Add horizontal scrolling with mouse drag
            let isDown = false;
            let startX;
            let scrollLeft;
            container = document.getElementById('cardsContainer');

           if (container) {
  container.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
    container.style.cursor = 'grabbing';
  });

  container.addEventListener('mouseleave', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mouseup', () => {
    isDown = false;
    container.style.cursor = 'grab';
  });

  container.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2;
    container.scrollLeft = scrollLeft - walk;
  });
} else {
  console.error("⚠️ cardsContainer not found.");
}

            

            // Animation for stats when they come into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = "1";
                        entry.target.style.transform = "translateY(0)";
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.stat-item').forEach(item => {
                item.style.opacity = "0";
                item.style.transform = "translateY(20px)";
                item.style.transition = "all 0.6s ease";
                observer.observe(item);
            });

            document.querySelectorAll('footer a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        function goToPage(url) {
  window.location.href = url;
}

    });

function setSearchCookie() {
      const destination = document.getElementById('search-input').value;
      // Set cookie with 5-minute expiration
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (5 * 60 * 1000)); // 5 minutes
      document.cookie = `hotelSearch=${encodeURIComponent(destination)}; expires=${expiryDate.toUTCString()}; path=/`;
    }


  // Load autocomplete once the page is ready


function setupDestinationCards() {
  const destinations = [/* your destination objects */];
  const cardsContainer = document.getElementById("cardsContainer");
  if (!cardsContainer) return;

  const fullList = Array(3).fill(destinations).flat();

  fullList.forEach(dest => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.backgroundImage = `url(${dest.image}?auto=compress&cs=tinysrgb&w=800)`;
    card.innerHTML = `
      <div class="card-content">
        <h3>${dest.title}</h3>
        <p>${dest.subtitle}</p>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
   window.goToPage = function (url) {
    window.location.href = url;
  }
}

let auth0 = null;

const configureClient = async () => {
  auth0 = await createAuth0Client({
    domain: "dev-srolq5coxmes27yo.us.auth0.com",
    client_id: "1DwVF3ZMshLbYevAMGFb6hhEj0kIIdFE",
    redirect_uri: "http://localhost:5500/index.html",
    cacheLocation: "localstorage"
  });
};

window.onload = async () => {
  await configureClient();

  // ✅ Fix autocomplete init here
  if (window.google && google.maps && google.maps.places) {
    const input = document.getElementById("destination-input");
    const options = { types: ["(cities)"] };
    const autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      console.log("✅ Selected place:", place);
    });
  } else {
    console.error("❌ Google Maps JS API not loaded");
  }

  // Handle redirect after login
  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/index.html");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    const user = await auth0.getUser();
    console.log("✅ Auth0 user:", user);

    const userData = {
      name: user.name || user.nickname,
      email: user.email
    };

     // ✅ Save to localStorage so other pages can access
  localStorage.setItem("authUser", JSON.stringify(user));
    // Send to backend
    fetch("http://localhost:5000/save-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ User saved to backend:", data))
      .catch((err) => console.error("❌ Backend error:", err));

    // Update UI
    document.getElementById("sign-in-btn").style.display = "none";
    document.getElementById("sign-up-btn").style.display = "none";
    document.getElementById("user-profile").style.display = "flex";

    document.getElementById("profile-name").textContent = userData.name;
    document.getElementById("profile-pic").src = user.picture || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

    const dropdownAvatar = document.getElementById("dropdown-avatar");
    if (dropdownAvatar) dropdownAvatar.src = user.picture;
    const dropdownName = document.getElementById("dropdown-username");
    if (dropdownName) dropdownName.textContent = userData.name;

  } else {
    console.log("🕵️ User not logged in");
  }
};

// Login handler
document.getElementById("sign-in-btn").addEventListener("click", async () => {
  await auth0.loginWithRedirect();
});

// Logout handler
function logout() {
  auth0.logout({
    returnTo: "http://localhost:5500/index.html"
  });
}



function toggleBookingHistory() {
  const box = document.getElementById("booking-history-box");
  if (!box) return;

  box.style.display = box.style.display === "none" ? "flex" : "none";
}


function downloadBookingPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Tripillow - Booking History", 20, 20);

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

// === Dropdown open/close logic ===

document.addEventListener("DOMContentLoaded", function () {
  const profileButton = document.getElementById('profile-button');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const userProfile = document.getElementById('user-profile');

  if (!profileButton || !dropdownMenu || !userProfile) {
    console.error("Dropdown elements not found");
    return;
  }

  // Toggle dropdown on button click
  profileButton.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  // Prevent closing when clicking inside dropdown
  dropdownMenu.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // Close dropdown on outside click
  document.addEventListener('click', function (event) {
    if (!userProfile.contains(event.target)) {
      dropdownMenu.classList.remove('show');
    }
  });
});

function setSearchCookie(event) {
  event.preventDefault(); // ⛔ Prevents default form submission

  const destination = document.getElementById("destination-input").value.trim();
  if (destination) {
    document.cookie = `destination=${encodeURIComponent(destination)}; path=/`;

    // ✅ Open hotelslist.html (only ONCE)
    // window.location.href = "hotelslist.html"; // open in same tab
    window.open('hotelslist.html', '_blank'); // open in new tab
  }

  return false; // Prevent double form behavior
}

const bookingList = document.getElementById("booking-list");
const storedUser = JSON.parse(localStorage.getItem("authUser") || "{}");

if (bookingList && storedUser.email) {
  fetch(`http://localhost:5000/get-bookings?email=${storedUser.email}`)
    .then(res => res.json())
    .then(bookings => {
      if (!Array.isArray(bookings)) {
        console.warn("Invalid booking response:", bookings);
        return;
      }

      bookingList.innerHTML = "";
      bookings.forEach(booking => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${booking.destination}</strong><br/>
          Hotel: ${booking.hotel}<br/>
          Check-in: ${booking.checkin} | Check-out: ${booking.checkout}
        `;
        bookingList.appendChild(li);
      });

      window._bookings = bookings; // For PDF
    })
    .catch(err => console.error("Failed to fetch bookings:", err));
}
