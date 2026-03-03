const API_KEY = 'c87455e9948fc402dc24ff1cd9cf65b5';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('search-btn');
const locBtn = document.getElementById('locBtn');
const cardsContainer = document.getElementById('cardsContainer');

async function getWeather(city) {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    /* send request & wait for response */
    const response = await fetch(url);
    /* transform the data into json to use it */
    const data = await response.json();
    console.log(data);
    return data;
}

async function getForecast(city) {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function createCard(weather, forecast) {
    const city = weather.name;
    const country = weather.sys.country;
    const temp = Math.round(weather.main.temp);
    const description = weather.weather[0].description;
    const humidity = weather.main.humidity;
    const wind = Math.round(weather.wind.speed);

    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="top">
            <h2 class="city-name">${city}</h2>
            <p class="country">${country}</p>
        </div>
        <div class="desc"">
            <div class="card-top">
                <div class="temp">${temp}°C</div>
            </div>
            <p class="description">${description}</p>
            <div class="stats">
                <p>💧 ${humidity}%</p>
                <p>💨 ${wind} m/s</p>
            </div>
        </div>
    `;
    cardsContainer.appendChild(card);
}

searchBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();

    if (!city)
        return;

    showLoading();

    const weather = await getWeather(city);
    const forecast = await getForecast(city);

    hideLoading();

    createCard(weather, forecast);

    cityInput.value = '';
});

locBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const weather = await response.json();

        const forecast = await getForecast(weather.name);
        createCard(weather, forecast);
    });
});

function showLoading() {
    const loading = document.createElement('div');
    loading.classList.add('loading');
    loading.id = 'loading';
    loading.innerHTML = `
        <div class="spinner"></div>
        <p>Loading...</p>
    `;
    cardsContainer.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading)
        loading.remove();
}