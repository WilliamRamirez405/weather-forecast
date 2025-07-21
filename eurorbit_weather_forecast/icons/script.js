document.getElementById("show-btn").addEventListener("click", () => {
  const city = document.getElementById("city-select").value;
  const forecastContainer = document.getElementById("forecast");

  if (!city) {
    alert("Por favor, selecciona una ciudad.");
    return;
  }

  const [cityName, countryCode] = city.split(",");
  const geocodeUrl = `https://geocode.xyz/${cityName},${countryCode}?json=1`;

  
  fetch(geocodeUrl)
    .then(response => response.json())
    .then(data => {
      if (!data.latt || !data.longt) {
        throw new Error("No se pudo geolocalizar la ciudad.");
      }

      const latitude = data.latt;
      const longitude = data.longt;

    
      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`;

      return fetch(forecastUrl);
    })
    .then(response => {
      if (!response.ok) throw new Error("No se pudo obtener el pronóstico.");
      return response.json();
    })
    .then(weather => {
      const current = weather.current_weather;

      forecastContainer.innerHTML = `
        <h3 class="text-center mb-4">Clima Actual</h3>
        <div class="row justify-content-center">
          <div class="col-md-4 weather-card text-center">
            <p><strong>Temperatura:</strong> ${current.temperature}°C</p>
            <p><strong>Viento:</strong> ${current.windspeed} km/h</p>
            <p><strong>Condición:</strong> ${current.weathercode}</p>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error("Error:", error);
      forecastContainer.innerHTML = `<p class="text-danger text-center">⚠️ ${error.message}</p>`;
    });
});

