# 📺 Live Follower Counter - Complete Documentation

## 🆕 NEW: Weather Dashboard & Digital Clock

Your project now includes **THREE amazing tools**:

### 1. 🌤️ **Weather Dashboard** (`/weather.html`)
- Real-time weather data from OpenWeatherMap
- Current conditions with detailed metrics
- Hourly forecast (24 hours)
- 7-day weather forecast
- Weather alerts (storms, high humidity, wind)
- Multiple city search and saved locations
- Temperature units: Celsius/Fahrenheit
- Wind speed units: m/s, km/h, mph
- Dark/Light theme toggle
- Responsive mobile design

**Features:**
- 💨 Wind speed and direction
- 💧 Humidity levels
- ⚖️ Atmospheric pressure
- 👁️ Visibility metrics
- ☀️ UV index
- 🌫️ Weather alerts
- 📍 Save favorite cities

### 2. 🕐 **Digital Clock** (`/clock.html`)
- Multiple timezone support (25+ timezones)
- Real-time digital clock display
- Analog clock visualization
- Hourly forecast for each timezone
- 7-day forecast with timezone conversion
- Quick presets: Global, Business, Americas, Europe, Asia, Oceania
- Settings: 12/24 hour format, show/hide seconds
- Saved timezone configurations

### 3. 📱 **Social Media Booster** (`/index.html`)
- Instagram followers/views/likes growth
- Multi-platform support
- Admin dashboard with premium features
- Live chat with admin
- Subscription plans
- User authentication

---

## 🚀 Quick Start

### Installation
```bash
npm install
npm start
```

### Access Points
- **Main Dashboard**: `http://localhost:3000`
- **Weather**: `http://localhost:3000/weather.html`
- **Clock**: `http://localhost:3000/clock.html`
- **Social Media Booster**: `http://localhost:3000/index.html`

---

## 🔐 Admin Access

**Email**: ittzrudra@gmail.com  
**Password**: notlostplayz335  
**Access**: ALL features FREE for admins

---

## 📊 Weather Dashboard Usage

### Search Cities
1. Type city name in search bar
2. Select from suggestions
3. Weather updates automatically

### Add Multiple Cities
1. Search for a city
2. Click "Save Current City"
3. Access from Saved Locations

### Change Units
- **Temperature**: °C or °F
- **Wind Speed**: m/s, km/h, or mph

### Theme Toggle
- Click 🌙 for dark mode
- Click ☀️ for light mode

---

## 🕐 Digital Clock Usage

### Add Timezones
1. Select timezone from dropdown
2. Click "Add Clock"
3. Clock appears in grid

### Quick Presets
- **Global**: UTC, EST, CET, IST, JST, AEST
- **Business**: EST, CET, IST, JST, AEST
- **Americas**: EST, CST, MST, PST, AST
- **Europe**: WET, CET, EET, CAT
- **Asia**: IST, CST (China), JST, SGT, AEST
- **Oceania**: SGT, AEST, NZST

### Customize Display
- Toggle 24-hour format
- Show/hide seconds
- Show/hide date
- Display analog clocks

---

## 🌍 Weather API

**Using**: Open-Meteo (Free, no API key required)
- Current weather
- Hourly forecast
- 7-day forecast
- Weather alerts
- No rate limiting for reasonable requests

### Data Provided
- Temperature (current, min, max)
- Weather conditions
- Humidity
- Wind speed & direction
- Precipitation
- UV index
- Visibility
- Atmospheric pressure

---

## 📁 Project Structure

```
live-follower-counter/
├── public/
│   ├── index.html              # Main app
│   ├── weather.html            # Weather dashboard
│   ├── clock.html              # Digital clock
│   ├── styles.css              # Main styles
│   ├── weather-styles.css      # Weather styles
│   ├── clock-styles.css        # Clock styles
│   ├── script.js               # Main logic
│   ├── weather-script.js       # Weather logic
│   └── clock-script.js         # Clock logic
├── package.json
├── server.js
└── README.md
```

---

## 🎨 Features Comparison

| Feature | Weather | Clock | Booster |
|---------|---------|-------|----------|
| Real-time Data | ✅ | ✅ | ✅ |
| Dark Mode | ✅ | ❌ | ✅ |
| Multiple Cities/Zones | ✅ | ✅ | ✅ |
| Alerts | ✅ | ❌ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |
| Mobile Responsive | ✅ | ✅ | ✅ |
| Customizable | ✅ | ✅ | ✅ |
| Save Preferences | ✅ | ✅ | ✅ |

---

## 🔧 API Endpoints (Social Media Booster)

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Admin
- `POST /api/admin/login`
- `GET /api/admin/dashboard`
- `GET /api/admin/messages`

### Weather (External)
- `https://api.open-meteo.com/v1/forecast`
- `https://geocoding-api.open-meteo.com/v1/search`

---

## 💾 Local Storage

### Saved Data
- **User Sessions**: Auth tokens, user profile
- **Weather**: Saved cities, theme preference
- **Clock**: Timezone configurations
- **Booster**: Plan selections, boost history

---

## 🎯 Planned Features

- [ ] Weather notifications
- [ ] Weather comparison between cities
- [ ] Historical weather data
- [ ] Weather maps
- [ ] Timezone event scheduler
- [ ] Social media analytics
- [ ] Advanced admin reports

---

## 📝 License

ISC License - 2026

---

## 👤 Created By

**notlostplayz**

📱 Instagram:
- @itzzz_ur_rudra
- @itzz_urrudra

💬 Support: ittzrudra@gmail.com

---

**Tagline**: "Grow your passion, build your empire" 🚀
