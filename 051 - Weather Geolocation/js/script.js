document.addEventListener('DOMContentLoaded', function () {
  var cityInput = document.getElementById('cityInput');
  var searchBtn = document.getElementById('searchBtn');
  var locateBtn = document.getElementById('locateBtn');
  var loadingEl = document.getElementById('loading');
  var weatherCard = document.getElementById('weatherCard');
  var errorEl = document.getElementById('error');
  var errorMsg = document.getElementById('errorMsg');

  var tempEl = document.getElementById('temp');
  var descriptionEl = document.getElementById('description');
  var cityNameEl = document.getElementById('cityName');
  var weatherIconEl = document.getElementById('weatherIcon');
  var feelsLikeEl = document.getElementById('feelsLike');
  var humidityEl = document.getElementById('humidity');
  var windEl = document.getElementById('wind');
  var pressureEl = document.getElementById('pressure');
  var uvEl = document.getElementById('uv');
  var precipEl = document.getElementById('precip');
  var forecastRow = document.getElementById('forecastRow');

  var weatherIcons = {
    0:'fa-sun',1:'fa-sun',2:'fa-cloud-sun',3:'fa-cloud',
    45:'fa-smog',48:'fa-smog',
    51:'fa-cloud-rain',53:'fa-cloud-rain',55:'fa-cloud-showers-heavy',
    61:'fa-cloud-rain',63:'fa-cloud-showers-heavy',65:'fa-cloud-showers-heavy',
    71:'fa-snowflake',73:'fa-snowflake',75:'fa-snowflake',
    80:'fa-cloud-showers-heavy',81:'fa-cloud-showers-heavy',82:'fa-cloud-showers-heavy',
    95:'fa-cloud-bolt',96:'fa-cloud-bolt',99:'fa-cloud-bolt'
  };
  var weatherColors = {
    0:'#fbbf24',1:'#fbbf24',2:'#7c819a',3:'#7c819a',
    45:'#7c819a',48:'#7c819a',51:'#60a5fa',53:'#60a5fa',55:'#60a5fa',
    61:'#60a5fa',63:'#3b82f6',65:'#3b82f6',71:'#e2e8f0',73:'#e2e8f0',75:'#e2e8f0',
    80:'#60a5fa',81:'#3b82f6',82:'#3b82f6',95:'#fbbf24',96:'#fbbf24',99:'#f87171'
  };
  var weatherDescs = {
    0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
    45:'Foggy',48:'Rime fog',51:'Light drizzle',53:'Moderate drizzle',55:'Dense drizzle',
    61:'Slight rain',63:'Moderate rain',65:'Heavy rain',71:'Light snow',73:'Moderate snow',75:'Heavy snow',
    80:'Rain showers',81:'Heavy showers',82:'Violent showers',95:'Thunderstorm',96:'Thunderstorm + hail',99:'Severe thunderstorm'
  };

  var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function showState(s) {
    loadingEl.classList.toggle('hidden', s !== 'loading');
    weatherCard.classList.toggle('hidden', s !== 'weather');
    errorEl.classList.toggle('hidden', s !== 'error');
  }

  function fetchWeatherByCoords(lat, lon, name) {
    showState('loading');
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,precipitation' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max' +
      '&timezone=auto&forecast_days=7';

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var c = data.current;
        var code = c.weather_code;

        tempEl.textContent = Math.round(c.temperature_2m) + '°C';
        descriptionEl.textContent = weatherDescs[code] || 'Unknown';
        cityNameEl.textContent = name;
        weatherIconEl.innerHTML = '<i class="fa-solid ' + (weatherIcons[code] || 'fa-cloud') + '" style="color:' + (weatherColors[code] || '#7c819a') + '"></i>';
        feelsLikeEl.textContent = Math.round(c.apparent_temperature) + '°C';
        humidityEl.textContent = c.relative_humidity_2m + '%';
        windEl.textContent = Math.round(c.wind_speed_10m) + ' km/h';
        pressureEl.textContent = Math.round(c.surface_pressure) + ' hPa';
        uvEl.textContent = data.daily.uv_index_max ? data.daily.uv_index_max[0] : '--';
        precipEl.textContent = c.precipitation + ' mm';

        forecastRow.innerHTML = '';
        for (var i = 0; i < 7; i++) {
          var d = new Date(data.daily.time[i]);
          var fc = data.daily.weather_code[i];
          var div = document.createElement('div');
          div.className = 'forecast-day';
          div.innerHTML =
            '<div class="fd-day">' + (i === 0 ? 'Today' : days[d.getDay()]) + '</div>' +
            '<div class="fd-icon"><i class="fa-solid ' + (weatherIcons[fc] || 'fa-cloud') + '" style="color:' + (weatherColors[fc] || '#7c819a') + '"></i></div>' +
            '<div class="fd-temp">' + Math.round(data.daily.temperature_2m_max[i]) + '° <span class="fd-low">' + Math.round(data.daily.temperature_2m_min[i]) + '°</span></div>';
          forecastRow.appendChild(div);
        }
        showState('weather');
      })
      .catch(function () {
        errorMsg.textContent = 'Failed to fetch weather data. Check your connection.';
        showState('error');
      });
  }

  function searchCity(city) {
    showState('loading');
    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        if (!geo.results || !geo.results.length) {
          errorMsg.textContent = 'City "' + city + '" not found. Try another name.';
          showState('error');
          return;
        }
        var loc = geo.results[0];
        var name = loc.name + (loc.admin1 ? ', ' + loc.admin1 : '') + ', ' + loc.country;
        fetchWeatherByCoords(loc.latitude, loc.longitude, name);
      })
      .catch(function () {
        errorMsg.textContent = 'Failed to search. Check your connection.';
        showState('error');
      });
  }

  function useGeolocation() {
    if (!navigator.geolocation) {
      errorMsg.textContent = 'Geolocation is not supported by your browser.';
      showState('error');
      return;
    }
    showState('loading');
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        fetch('https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en&format=json')
          .catch(function () {});
        fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json')
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var addr = data.address || {};
            var name = addr.city || addr.town || addr.village || addr.county || 'Your Location';
            name += addr.country ? ', ' + addr.country : '';
            fetchWeatherByCoords(lat, lon, name);
          })
          .catch(function () {
            fetchWeatherByCoords(lat, lon, 'Lat ' + lat.toFixed(2) + ', Lon ' + lon.toFixed(2));
          });
      },
      function () {
        errorMsg.textContent = 'Location access denied. Search by city instead.';
        showState('error');
      }
    );
  }

  searchBtn.addEventListener('click', function () {
    var city = cityInput.value.trim();
    if (city) searchCity(city);
  });
  cityInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var city = cityInput.value.trim(); if (city) searchCity(city); }
  });
  locateBtn.addEventListener('click', useGeolocation);

  useGeolocation();
});
