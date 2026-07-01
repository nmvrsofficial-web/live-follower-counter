// Configuration
const API_KEY = 'demo'; // Replace with actual OpenWeatherMap API key
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast'; // Using free API (no key required)
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';

let currentCity = { name: 'London', lat: 51.5074, lon: -0.1278 };
let tempUnit = 'C';
let speedUnit = 'm/s';
let isDarkMode = false;
let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

const WEATHER_ICONS = {
  'Clear': '☀️',
  'Cloudy': '☁️',
  'Rainy': '🌧️',
  'Thunderstorm': '⛈️',
  'Snowy': '❄️',
  'Windy': '💨',
  'Foggy': '🌫️',
  'PartlyCloudy': '⛅',
  'Overcast': '☁️'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadThemePreference();
  loadSavedCities();
  fetchWeather();
  setInterval(fetchWeather, 600000); // Update every 10 minutes
});

// Load theme
function loadThemePreference() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
    document.getElementById('themeBtn').textContent = '☀️';
  }
}

// Toggle theme
function toggleTheme() {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.getElementById('themeBtn').textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-mode');
    document.getElementById('themeBtn').textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Search functionality
async function handleSearch() {
  const input = document.getElementById('citySearch').value.trim();
  if (input.length < 2) {
    document.getElementById('suggestions').classList.remove('active');
    return;
  }

  try {
    const response = await fetch(`${GEO_API}?name=${input}&count=5&language=en`);
    const data = await response.json();
    
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = '';
    
    if (data.results) {
      data.results.forEach(result => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = `${result.name}${result.admin1 ? ', ' + result.admin1 : ''}${result.country ? ', ' + result.country : ''}`;
        div.onclick = () => selectCity(result);
        suggestions.appendChild(div);
      });
      suggestions.classList.add('active');
    }
  } catch (error) {
    console.error('Search error:', error);
  }
}

// Select city from suggestions
function selectCity(city) {
  currentCity = {
    name: city.name,
    lat: city.latitude,
    lon: city.longitude,
    country: city.country
  };
  document.getElementById('citySearch').value = '';
  document.getElementById('suggestions').classList.remove('active');
  fetchWeather();
}

// Search city
function searchCity() {
  const cityName = document.getElementById('citySearch').value.trim();
  if (cityName) {
    handleSearch();
  }
}

// Fetch weather data
async function fetchWeather() {
  try {
    const response = await fetch(
      `${WEATHER_API}?latitude=${currentCity.lat}&longitude=${currentCity.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto`
    );
    
    const data = await response.json();
    displayWeather(data);
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
  } catch (error) {
    console.error('Weather fetch error:', error);
    document.getElementById('currentWeather').innerHTML = '<div class="loading">Error loading weather data</div>';
  }
}

// Display weather
function displayWeather(data) {
  // Current weather
  displayCurrentWeather(data.current);
  
  // Quick stats
  displayQuickStats(data.current);
  
  // Hourly forecast
  displayHourlyForecast(data.hourly);
  
  // Daily forecast
  displayDailyForecast(data.daily);
  
  // Detailed metrics
  displayDetailedMetrics(data.current);
  
  // Weather alerts (simulated)
  displayWeatherAlerts(data.current);
}

// Display current weather
function displayCurrentWeather(current) {
  const temp = convertTemp(current.temperature_2m);
  const feelsLike = convertTemp(current.apparent_temperature);
  const weatherCode = current.weather_code;
  const weatherDesc = getWeatherDescription(weatherCode);
  const icon = getWeatherIcon(weatherCode);
  const windSpeed = convertSpeed(current.wind_speed_10m);
  
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const html = `
    <div class="weather-header">
      <div class="weather-location">
        <div class="city-name">${currentCity.name}${currentCity.country ? ', ' + currentCity.country : ''}</div>
        <div class="city-date">${date}</div>
      </div>
    </div>
    <div class="weather-main">
      <div class="weather-icon">${icon}</div>
      <div class="temperature-section">
        <div class="current-temp">${Math.round(temp)}°${tempUnit}</div>
        <div class="weather-description">${weatherDesc}</div>
        <div class="feels-like">Feels like ${Math.round(feelsLike)}°${tempUnit}</div>
      </div>
    </div>
  `;
  
  document.getElementById('currentWeather').innerHTML = html;
}

// Display quick stats
function displayQuickStats(current) {
  const html = `
    <div class="stat-card">
      <div class="stat-label">💧 Humidity</div>
      <div class="stat-value">${current.relative_humidity_2m}%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">💨 Wind Speed</div>
      <div class="stat-value">${convertSpeed(current.wind_speed_10m).toFixed(1)} ${getSpeedUnit()}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">🧭 Wind Direction</div>
      <div class="stat-value">${getWindDirection(current.wind_direction_10m)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">🌡️ Feels Like</div>
      <div class="stat-value">${Math.round(convertTemp(current.apparent_temperature))}°${tempUnit}</div>
    </div>
  `;
  
  document.getElementById('quickStats').innerHTML = html;
}

// Display hourly forecast
function displayHourlyForecast(hourly) {
  let html = '';
  const now = new Date();
  
  for (let i = 0; i < Math.min(24, hourly.time.length); i++) {
    const time = new Date(hourly.time[i]);
    const hour = time.getHours();
    const temp = convertTemp(hourly.temperature_2m[i]);
    const icon = getWeatherIcon(hourly.weather_code[i]);
    
    html += `
      <div class="hourly-item">
        <div class="hourly-time">${hour}:00</div>
        <div class="hourly-icon">${icon}</div>
        <div class="hourly-temp">${Math.round(temp)}°</div>
      </div>
    `;
  }
  
  document.getElementById('hourlyForecast').innerHTML = html;
}

// Display daily forecast
function displayDailyForecast(daily) {
  let html = '';
  
  for (let i = 0; i < Math.min(7, daily.time.length); i++) {
    const date = new Date(daily.time[i]);
    const maxTemp = convertTemp(daily.temperature_2m_max[i]);
    const minTemp = convertTemp(daily.temperature_2m_min[i]);
    const weatherCode = daily.weather_code[i];
    const description = getWeatherDescription(weatherCode);
    const icon = getWeatherIcon(weatherCode);
    const precipitation = daily.precipitation_sum[i] || 0;
    const windSpeed = convertSpeed(daily.wind_speed_10m_max[i]);
    const uvIndex = daily.uv_index_max[i];
    
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    
    html += `
      <div class="daily-item">
        <div class="daily-date">${dateStr}</div>
        <div class="daily-icon">${icon}</div>
        <div class="daily-description">${description}</div>
        <div class="daily-temps">
          <div class="temp-group">
            <div class="temp-label">High</div>
            <div class="temp-value">${Math.round(maxTemp)}°${tempUnit}</div>
          </div>
          <div class="temp-group">
            <div class="temp-label">Low</div>
            <div class="temp-value">${Math.round(minTemp)}°${tempUnit}</div>
          </div>
        </div>
        <div class="daily-details">
          <span>💧 ${precipitation}mm</span>
          <span>💨 ${windSpeed.toFixed(1)} ${getSpeedUnit()}</span>
          <span>☀️ UV ${Math.round(uvIndex)}</span>
        </div>
      </div>
    `;
  }
  
  document.getElementById('dailyForecast').innerHTML = html;
}

// Display detailed metrics
function displayDetailedMetrics(current) {
  const humidity = current.relative_humidity_2m;
  const windSpeed = convertSpeed(current.wind_speed_10m);
  const pressure = (current.pressure || 1013).toFixed(0);
  const visibility = (current.visibility || 10).toFixed(1);
  
  const html = `
    <h3>📊 Detailed Metrics</h3>
    <div class="metrics-grid">
      <div class="metric-item">
        <div class="metric-name">💧 Humidity</div>
        <div class="metric-value">${humidity}%</div>
        <div class="metric-bar">
          <div class="metric-bar-fill" style="width: ${humidity}%"></div>
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-name">💨 Wind Speed</div>
        <div class="metric-value">${windSpeed.toFixed(1)}</div>
        <div style="font-size: 12px; color: #999;">${getSpeedUnit()}</div>
      </div>
      <div class="metric-item">
        <div class="metric-name">⚖️ Pressure</div>
        <div class="metric-value">${pressure}</div>
        <div style="font-size: 12px; color: #999;">hPa</div>
      </div>
      <div class="metric-item">
        <div class="metric-name">👁️ Visibility</div>
        <div class="metric-value">${visibility}</div>
        <div style="font-size: 12px; color: #999;">km</div>
      </div>
    </div>
  `;
  
  document.getElementById('detailedMetrics').innerHTML = html;
}

// Display weather alerts
function displayWeatherAlerts(current) {
  const alerts = document.getElementById('weatherAlerts');
  alerts.innerHTML = '';
  
  const weatherCode = current.weather_code;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  
  // Extreme weather alert
  if (weatherCode >= 80 && weatherCode <= 99) {
    alerts.innerHTML += `
      <div class="alert warning">
        <div class="alert-icon">⛈️</div>
        <div class="alert-content">
          <h4>Severe Weather Alert</h4>
          <p>Thunderstorm expected. Stay safe and avoid outdoor activities.</p>
        </div>
      </div>
    `;
  }
  
  // High humidity alert
  if (humidity > 80) {
    alerts.innerHTML += `
      <div class="alert info">
        <div class="alert-icon">💧</div>
        <div class="alert-content">
          <h4>High Humidity</h4>
          <p>Humidity is above 80%. Stay hydrated!</p>
        </div>
      </div>
    `;
  }
  
  // High wind alert
  if (windSpeed > 25) {
    alerts.innerHTML += `
      <div class="alert danger">
        <div class="alert-icon">💨</div>
        <div class="alert-content">
          <h4>High Wind Speed</h4>
          <p>Strong winds detected. Secure loose objects and be careful outdoors.</p>
        </div>
      </div>
    `;
  }
}

// Helper functions
function convertTemp(celsius) {
  if (tempUnit === 'F') {
    return (celsius * 9/5) + 32;
  }
  return celsius;
}

function convertSpeed(mps) {
  if (speedUnit === 'km/h') {
    return mps * 3.6;
  } else if (speedUnit === 'mph') {
    return mps * 2.237;
  }
  return mps;
}

function getSpeedUnit() {
  if (speedUnit === 'km/h') return 'km/h';
  if (speedUnit === 'mph') return 'mph';
  return 'm/s';
}

function getWeatherIcon(code) {
  if (code === 0 || code === 1) return '☀️'; // Clear
  if (code === 2) return '⛅'; // Partly cloudy
  if (code === 3) return '☁️'; // Overcast
  if (code === 45 || code === 48) return '🌫️'; // Foggy
  if (code >= 51 && code <= 77) return '🌧️'; // Rainy
  if (code >= 80 && code <= 82) return '🌧️'; // Rain showers
  if (code >= 85 && code <= 86) return '❄️'; // Snow showers
  if (code >= 80 && code <= 99) return '⛈️'; // Thunderstorm
  return '☁️';
}

function getWeatherDescription(code) {
  if (code === 0 || code === 1) return 'Clear Sky';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy';
  if (code >= 51 && code <= 67) return 'Drizzle';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 85 && code <= 86) return 'Snow Showers';
  if (code === 95 || code === 96 || code === 99) return 'Thunderstorm';
  return 'Unknown';
}

function getWindDirection(degrees) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}

// Settings
function changeTempUnit() {
  const selected = document.querySelector('input[name="tempUnit"]:checked').value;
  tempUnit = selected;
  fetchWeather();
}

function changeSpeedUnit() {
  const selected = document.querySelector('input[name="speedUnit"]:checked').value;
  speedUnit = selected;
  fetchWeather();
}

// Saved cities
function saveCityToList() {
  const city = {
    name: currentCity.name,
    lat: currentCity.lat,
    lon: currentCity.lon,
    country: currentCity.country
  };
  
  if (!savedCities.find(c => c.lat === city.lat && c.lon === city.lon)) {
    savedCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
    loadSavedCities();
    alert('✅ City saved!');
  } else {
    alert('⚠️ City already saved!');
  }
}

function loadSavedCities() {
  const container = document.getElementById('savedLocations');
  container.innerHTML = '';
  
  savedCities.forEach((city, index) => {
    const div = document.createElement('div');
    div.className = 'location-card';
    div.innerHTML = `
      <span class="location-name" onclick="loadCity(${index})" style="cursor: pointer;">📍 ${city.name}</span>
      <button class="location-remove" onclick="removeCity(${index})">Remove</button>
    `;
    container.appendChild(div);
  });
}

function loadCity(index) {
  const city = savedCities[index];
  currentCity = city;
  fetchWeather();
}

function removeCity(index) {
  savedCities.splice(index, 1);
  localStorage.setItem('savedCities', JSON.stringify(savedCities));
  loadSavedCities();
}
