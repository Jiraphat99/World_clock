// List of cities and their timezones
const cities = [
  { name: "New York", timezone: "America/New_York" },
  { name: "London", timezone: "Europe/London" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
  { name: "Rome", timezone: "Europe/Rome" },
];

// Function to update times
function updateTimes() {
  const cards = document.querySelectorAll(".city-card");

  cities.forEach((city, index) => {
    const card = cards[index];
    const timeElement = card.querySelector(".time");

    // Format the time for the city's timezone
    const currentTime = moment().tz(city.timezone).format("HH:mm:ss");
    timeElement.textContent = currentTime;
  });
}

// Update every second
setInterval(updateTimes, 1000);

// Run once on page load
updateTimes();
