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
];

const select = document.getElementById("city-select");
const track = document.querySelector(".carousel-track");
let currentIndex = 0;

function createCityCard(city) {
  const card = document.createElement("div");
  card.classList.add("city-card");
  card.style.backgroundImage = `url('${city.img}')`;
  card.innerHTML = `
    <div class="overlay"></div>
    <div class="content">
      <h2>${city.name}</h2>
      <p class="country">${city.country}</p>
      <div class="time">--:--:--</div>
      <p class="utc">UTC ${moment().tz(city.timezone).format("Z")}</p>
      <p class="temp">--°C</p>
    </div>
  `;
  return card;
}

function populateSelect() {
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
    const cityName = card.querySelector("h2").textContent;
    const city = cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (!city) return;
    const timeElement = card.querySelector(".time");
    timeElement.textContent = moment().tz(city.timezone).format("HH:mm:ss");
    const utcElement = card.querySelector(".utc");
    utcElement.textContent = "UTC " + moment().tz(city.timezone).format("Z");
  });
}

function updateCarousel() {
  const cards = document.querySelectorAll(".city-card");
  if (cards.length === 0) return;
  const cardWidth = cards[0].offsetWidth;
  track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Populate select and initial cards on page load
populateSelect();
setInterval(updateTimes, 1000);
updateTimes();

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
    const city = cities.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (city) saved.push(city);
  });
  localStorage.setItem("addedCities", JSON.stringify(saved));
}

function loadCitiesFromStorage() {
  const stored = JSON.parse(localStorage.getItem("addedCities")) || [];
  stored.forEach((city) => addCityCard(city));
}

// When user clicks "Add Selected City"
document.getElementById("add-selected-btn").addEventListener("click", () => {
  const value = select.value;
  if (!value) return;

  const [timezone, country, img] = value.split("|");
  const cityName = timezone.split("/")[1].replace("_", " ");

  const city = { name: cityName, country, timezone, img };
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
