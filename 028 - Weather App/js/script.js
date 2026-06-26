document.addEventListener('DOMContentLoaded', function () {
  var cityInput = document.getElementById('cityInput');
  var searchBtn = document.getElementById('searchBtn');
  var placeholder = document.getElementById('placeholder');
  var weatherContent = document.getElementById('weatherContent');
  var error = document.getElementById('error');
  var errorMsg = document.getElementById('errorMsg');

  var tempEl = document.getElementById('temp');
  var descriptionEl = document.getElementById('description');
  var cityNameEl = document.getElementById('cityName');
  var weatherIconEl = document.getElementById('weatherIcon');
  var feelsLikeEl = document.getElementById('feelsLike');
  var humidityEl = document.getElementById('humidity');
  var windEl = document.getElementById('wind');
  var pressureEl = document.getElementById('pressure');
  var visibilityEl = document.getElementById('visibility');
  var uvEl = document.getElementById('uv');

  var weatherIcons = {
    0: { icon: 'fa-sun', color: '#fbbf24' },
    1: { icon: 'fa-sun', color: '#fbbf24' },
    2: { icon: 'fa-cloud-sun', color: '#7c819a' },
    3: { icon: 'fa-cloud', color: '#7c819a' },
    45: { icon: 'fa-smog', color: '#7c819a' },
    48: { icon: 'fa-smog', color: '#7c819a' },
    51: { icon: 'fa-cloud-rain', color: '#60a5fa' },
    53: { icon: 'fa-cloud-rain', color: '#60a5fa' },
    55: { icon: 'fa-cloud-showers-heavy', color: '#60a5fa' },
    61: { icon: 'fa-cloud-rain', color: '#60a5fa' },
    63: { icon: 'fa-cloud-showers-heavy', color: '#60a5fa' },
    65: { icon: 'fa-cloud-showers-heavy', color: '#3b82f6' },
    71: { icon: 'fa-snowflake', color: '#e2e8f0' },
    73: { icon: 'fa-snowflake', color: '#e2e8f0' },
    75: { icon: 'fa-snowflake', color: '#e2e8f0' },
    80: { icon: 'fa-cloud-showers-heavy', color: '#60a5fa' },
    81: { icon: 'fa-cloud-showers-heavy', color: '#3b82f6' },
    82: { icon: 'fa-cloud-showers-heavy', color: '#3b82f6' },
    95: { icon: 'fa-cloud-bolt', color: '#fbbf24' },
    96: { icon: 'fa-cloud-bolt', color: '#fbbf24' },
    99: { icon: 'fa-cloud-bolt', color: '#f87171' }
  };

  var weatherDescriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
    80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Severe thunderstorm'
  };

  function showState(state) {
    placeholder.classList.toggle('hidden', state !== 'placeholder');
    weatherContent.classList.toggle('hidden', state !== 'weather');
    error.classList.toggle('hidden', state !== 'error');
  }

  function fetchWeather(city) {
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1')
      .then(function (res) { return res.json(); })
      .then(function (geo) {
        if (!geo.results || geo.results.length === 0) {
          errorMsg.textContent = 'City "' + city + '" not found. Please try again.';
          showState('error');
          return Promise.reject('not found');
        }

        var loc = geo.results[0];
        var name = loc.name + (loc.admin1 ? ', ' + loc.admin1 : '') + ', ' + loc.country;

        return fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=' + loc.latitude +
          '&longitude=' + loc.longitude +
          '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure' +
          '&daily=uv_index_max&timezone=auto&forecast_days=1'
        )
          .then(function (res) { return res.json(); })
          .then(function (data) {
            var c = data.current;
            var code = c.weather_code;
            var iconData = weatherIcons[code] || weatherIcons[3];

            tempEl.textContent = Math.round(c.temperature_2m) + '°C';
            descriptionEl.textContent = weatherDescriptions[code] || 'Unknown';
            cityNameEl.textContent = name;

            weatherIconEl.innerHTML = '<i class="fa-solid ' + iconData.icon + '" style="color:' + iconData.color + '"></i>';

            feelsLikeEl.textContent = Math.round(c.apparent_temperature) + '°C';
            humidityEl.textContent = c.relative_humidity_2m + '%';
            windEl.textContent = Math.round(c.wind_speed_10m) + ' km/h';
            pressureEl.textContent = Math.round(c.surface_pressure) + ' hPa';
            visibilityEl.textContent = '--';
            uvEl.textContent = data.daily && data.daily.uv_index_max ? data.daily.uv_index_max[0] : '--';

            showState('weather');
          });
      })
      .catch(function (err) {
        if (err !== 'not found') {
          errorMsg.textContent = 'Failed to fetch weather data. Check your connection.';
          showState('error');
        }
      });
  }

  function search() {
    var city = cityInput.value.trim();
    if (!city) return;
    fetchWeather(city);
  }

  searchBtn.addEventListener('click', search);
  cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') search();
  });
});
