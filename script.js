const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

// HTML Elements
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const locationButton = document.getElementById("locationButton");
const displayContainer = document.getElementById("displayContainer");
const forecastContainer = document.getElementById("forecast");
const cityName = document.getElementById("cityName");
const dateElement = document.getElementById("date");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const humidity = document.getElementById("humidity");
const weatherIcon = document.getElementById("weatherIcon");
const weatherDescription = document.getElementById("weatherDescription");

// Event listeners
searchButton.addEventListener("click", () =>
  fetchWeatherByCity(cityInput.value)
);
locationButton.addEventListener("click", fetchWeatherByLocation);

// Fetch weather by city name
async function fetchWeatherByCity(city) {
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (data.cod !== 200) throw new Error(data.message);
    displayCurrentWeather(data);
    fetchForecastByCity(city);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Fetch 5-day forecast by city name
async function fetchForecastByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (data.cod !== "200") throw new Error(data.message);
    displayForecast(data);
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Fetch weather by current location
function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      displayCurrentWeather(data);
      fetchForecastByCity(data.name);
    } catch (error) {
      alert("Failed to retrieve weather data for your location.");
    }
  });
}

// Display current weather information
function displayCurrentWeather(data) {
  const { name, main, weather, wind } = data;
  cityName.textContent = `${name} (${new Date().toISOString().split("T")[0]})`;
  temperature.textContent = main.temp;
  windSpeed.textContent = wind.speed;
  humidity.textContent = main.humidity;
  weatherDescription.textContent = weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  displayContainer.classList.remove("hidden");
}

// Display 5-day forecast
function displayForecast(data) {
  forecastContainer.innerHTML = ""; // Clear previous forecast
  data.list.forEach((item, index) => {
    if (index % 8 === 0) {
      // Show one forecast per day
      const forecastDate = new Date(item.dt * 1000).toISOString().split("T")[0];
      forecastContainer.innerHTML += `
        <div class="bg-gray-200 p-4 rounded-lg text-center shadow-lg">
          <p class="text-lg font-semibold">${forecastDate}</p>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" class="w-12 h-12 mx-auto" alt="${item.weather[0].description}">
          <p>Temp: ${item.main.temp}°C</p>
          <p>Wind: ${item.wind.speed} m/s</p>
          <p>Humidity: ${item.main.humidity}%</p>
        </div>
      `;
    }
  });
  forecastContainer.classList.remove("hidden");
}
