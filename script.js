const apiKey = "15f7050969f864b12aeeefd42ba2c111";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const recentList = document.getElementById("recentList");

const cityName = document.getElementById("cityName");
const dateTime = document.getElementById("dateTime");

const weatherDisplay = document.getElementById("weatherDisplay");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");

const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");

// Set Date & Time
function updateDateTime() {
  const now = new Date();
  dateTime.innerText = now.toDateString() + " | " + now.toLocaleTimeString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Fetch Weather
async function getWeather(city) {
  errorMsg.classList.add("hidden");
  weatherDisplay.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    loader.classList.add("hidden");
    weatherDisplay.classList.remove("hidden");

    cityName.innerText = `${data.name}, ${data.sys.country}`;

    temperature.innerText = `${Math.round(data.main.temp)}°C`;
    condition.innerText = data.weather[0].description.toUpperCase();

    feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`;
    humidity.innerText = `${data.main.humidity}%`;
    wind.innerText = `${data.wind.speed} m/s`;
    pressure.innerText = `${data.main.pressure} hPa`;

    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    addRecent(city);

  } catch (error) {
    loader.classList.add("hidden");
    errorMsg.classList.remove("hidden");
  }
}

// Recent Search Add
function addRecent(city) {
  const items = Array.from(recentList.children).map(li => li.innerText.toLowerCase());

  if (!items.includes(city.toLowerCase())) {
    const li = document.createElement("li");
    li.innerText = city;
    recentList.prepend(li);

    li.addEventListener("click", () => {
      getWeather(li.innerText);
    });
  }
}

// Search Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    getWeather(city);
    cityInput.value = "";
  }
});

// Enter Key Search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Recent Click Default
Array.from(recentList.children).forEach(li => {
  li.addEventListener("click", () => {
    getWeather(li.innerText);
  });
});
