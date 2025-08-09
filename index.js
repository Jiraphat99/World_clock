const cities = [
  {
    name: "New York",
    country: "United States",
    timezone: "America/New_York",
    img: "images/newyork.jpg",
  },
  {
    name: "London",
    country: "United Kingdom",
    timezone: "Europe/London",
    img: "images/london.jpg",
  },
  {
    name: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
    img: "images/tokyo.jpg",
  },
  {
    name: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
    img: "images/sydney.jpg",
  },
  {
    name: "Rio de Janeiro",
    country: "Brazil",
    timezone: "America/Sao_Paulo",
    img: "images/rio.jpg",
  },
  {
    name: "Rome",
    country: "Italy",
    timezone: "Europe/Rome",
    img: "images/rome.jpg",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    timezone: "Asia/Bangkok",
    img: "images/bangkok.jpg",
  },
  {
    name: "Paris",
    country: "France",
    timezone: "Europe/Paris",
    img: "images/paris.jpg",
  },
  {
    name: "Shanghai",
    country: "China",
    timezone: "Asia/Shanghai",
    img: "images/shanghai.jpg",
  },
  {
    name: "Los Angeles",
    country: "United States",
    timezone: "America/Los_Angeles",
    img: "images/losangeles.jpg",
  },
  {
    name: "Johannesburg",
    country: "South Africa",
    timezone: "Africa/Johannesburg",
    img: "images/johannesburg.jpg",
  },
  {
    name: "Moscow",
    country: "Russia",
    timezone: "Europe/Moscow",
    img: "images/moscow.jpg",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    timezone: "Asia/Dubai",
    img: "images/dubai.jpg",
  },
  {
    name: "Mexico City",
    country: "Mexico",
    timezone: "America/Mexico_City",
    img: "images/mexicocity.jpg",
  },
  {
    name: "Berlin",
    country: "Germany",
    timezone: "Europe/Berlin",
    img: "images/berlin.jpg",
  },
  {
    name: "Seoul",
    country: "South Korea",
    timezone: "Asia/Seoul",
    img: "images/seoul.jpg",
  },
  {
    name: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
    img: "images/toronto.jpg",
  },
  {
    name: "Kolkata",
    country: "India",
    timezone: "Asia/Kolkata",
    img: "images/kolkata.jpg",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    timezone: "Europe/Istanbul",
    img: "images/istanbul.jpg",
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    timezone: "Europe/Amsterdam",
    img: "images/amsterdam.jpg",
  },
];

const select = document.getElementById("city-select");
const track = document.querySelector(".carousel-track");
let currentIndex = 0;

function createCityCard(city) {
  const card = document.createElement("div");
  card.classList.add("city-card");
  card.style.backgroundImage = `url('${city.img}')`;
  card.dataset.timezone = city.timezone; // store timezone
  card.innerHTML = `
    <div class="overlay"></div>
    <div class="content">
      <h2>${city.name}</h2>
      <p class="country">${city.country}</p>
      <div class="time">--:--:--</div>
      <p class="utc">UTC --</p>
      <p class="temp">--°C</p>
    </div>
  `;
  return card;
}

function populateSelect() {
  // Add Current Location as the first option
  const currentLocOption = document.createElement("option");
  currentLocOption.value = "current|Local|images/currentlocation.jpg";
  currentLocOption.textContent = "Current Location";
  select.appendChild(currentLocOption);

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = `${city.timezone}|${city.country}|${city.img}`;
    option.textContent = city.name;
    select.appendChild(option);
  });
}

function addCityCard(city) {
  // Check duplicate
  const cards = document.querySelectorAll(".city-card");
  for (let card of cards) {
    if (
      card.querySelector("h2").textContent.toLowerCase() ===
      city.name.toLowerCase()
    ) {
      alert(`${city.name} is already added.`);
      return false;
    }
  }
  const card = createCityCard(city);
  track.appendChild(card);
  return true;
}

function updateTimes() {
  const cards = document.querySelectorAll(".city-card");
  cards.forEach((card) => {
    const timezone = card.dataset.timezone;
    if (!timezone) return;

    const timeElement = card.querySelector(".time");
    const utcElement = card.querySelector(".utc");

    timeElement.textContent = moment().tz(timezone).format("HH:mm:ss");
    utcElement.textContent = "UTC " + moment().tz(timezone).format("Z");
  });
}

function updateCarousel() {
  const cards = document.querySelectorAll(".city-card");
  if (cards.length === 0) return;
  const cardWidth = cards[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

document.getElementById("next-btn").addEventListener("click", () => {
  const cards = document.querySelectorAll(".city-card");
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateCarousel();
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
});

function saveCitiesToStorage() {
  const cards = document.querySelectorAll(".city-card");
  const saved = [];
  cards.forEach((card) => {
    const name = card.querySelector("h2").textContent;
    const country = card.querySelector(".country").textContent;
    const timezone = card.dataset.timezone;
    const img = card.style.backgroundImage.slice(5, -2);
    saved.push({ name, country, timezone, img });
  });
  localStorage.setItem("addedCities", JSON.stringify(saved));
}

function loadCitiesFromStorage() {
  const stored = JSON.parse(localStorage.getItem("addedCities")) || [];
  stored.forEach((city) => {
    // Override 'current' or maybe even if city.name is "Current Location"
    if (
      city.timezone === "current" ||
      city.name.toLowerCase().includes("current location")
    ) {
      city.timezone = moment.tz.guess();
      city.name = city.timezone.split("/")[1].replace("_", " ");
      city.img = "images/currentlocation.jpg";
    }
    addCityCard(city);
  });
}

// When user clicks "Add Selected City"
document.getElementById("add-selected-btn").addEventListener("click", () => {
  const value = select.value;
  if (!value) return;

  let [timezone, country, img] = value.split("|");
  let cityName = "";

  if (timezone === "current") {
    // Get browser's current timezone
    const currentTz = moment.tz.guess();

    // Try to find city info matching the timezone
    const matchedCity = cities.find((c) => c.timezone === currentTz);

    if (matchedCity) {
      timezone = matchedCity.timezone;
      cityName = matchedCity.name;
      country = matchedCity.country;
      img = matchedCity.img;
    } else {
      // Fallback if not found
      timezone = currentTz;
      cityName = currentTz.split("/")[1].replace("_", " ");
      country = "Local";
      img = "images/currentlocation.jpg";
    }
  } else {
    cityName = timezone.split("/")[1].replace("_", " ");
  }

  const city = {
    name: cityName,
    country: country,
    timezone: timezone,
    img: img,
  };

  if (addCityCard(city)) {
    saveCitiesToStorage();
    currentIndex = document.querySelectorAll(".city-card").length - 1;
    updateCarousel();
  }
});

// save after deleting cities (if add delete functionality later)

populateSelect();
loadCitiesFromStorage();
setInterval(updateTimes, 1000);
updateTimes();
