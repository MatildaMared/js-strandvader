let forecastDayElements = "";
let city = "Tylösand";
const forecastElement = document.querySelector(".weather__forecast-wrapper");
const currentWeatherElement = document.querySelector(".weather__current-wrapper");
const searchbar = document.querySelector(".header__searchbar");
const searchBtn = document.querySelector(".header__searchbtn");
const errorElement = document.querySelector(".error");

// Sorting data based on date and returning a new array
const sortWeatherArray = function (data) {
	let weatherArray = [[], [], [], [], [], []];
	let compareDate = data.list[0].dt_txt.split(" ")[0];
	let currentIndex = 0;

	data.list.forEach((forecast) => {
		let date = forecast.dt_txt.split(" ")[0];
		if (date === compareDate) {
			weatherArray[currentIndex].push(forecast);
		} else if (date !== compareDate) {
			currentIndex++;
			weatherArray[currentIndex].push(forecast);
			compareDate = date;
		}
	});

	return weatherArray;
};

const renderForecast = function (weatherArray) {
	weatherArray.forEach((day, i, arr) => {
		const dayElement = document.createElement("div");

		// Current date
		let date = day[0].dt_txt.split(" ")[0];

		// Checks if current date is equal to today or tomorrow, and update variable dateString accordingly
		let dateString;
		if (date === arr[0][0].dt_txt.split(" ")[0]) {
			dateString = "Idag";
			dayElement.classList.add("active");
		} else if (date === arr[1][0].dt_txt.split(" ")[0]) {
			dateString = "Imorgon";
		} else {
			dateString = generateDateString(date);
		}

		dayElement.classList.add("forecast-day");
		dayElement.innerHTML = `
        <h1 class="forecast-day__heading">${dateString}</h1>
        `;

		day.forEach((forecastTime) => {
			// Forecast time
            const time = forecastTime.dt_txt.split(" ")[1].substring(0, 2);
            const timeOfDay = time < 6 || time > 20 ? "night" : "day";

			// Generating hourly forecast HTML
			const forecastHTML = `
            <div class="forecast">
                <div class="forecast__time">
                    <i class="wi wi-time-${time}"></i>
                    <p>${time}:00</p>
                </div>
                <div class="forecast__description">
                    <i class="wi wi-owm-${timeOfDay}-${+forecastTime.weather[0].id}"></i>
                    <p>${forecastTime.weather[0].description}</p>
                </div>
                <div class="forecast__temperature">
                    <i class="wi wi-thermometer"></i>
                    <p>${Math.round(+forecastTime.main.temp)}°</p>
                </div>
                <div class="forecast__wind">
                    <i class="wi wi-wind towards-${+forecastTime.wind.deg}-deg"></i>
                    <p>${Math.round(+forecastTime.wind.speed)} m/s</p>
                </div>
            </div>
            `;

			dayElement.insertAdjacentHTML("beforeend", forecastHTML);
		});

		forecastElement.insertAdjacentElement("beforeend", dayElement);
	});

	forecastDayElements = document.querySelectorAll(".forecast-day");
	addExpandFunctionality(forecastDayElements);
};

// Generates a swedish date based on the date
const generateDateString = function (date) {
    const months = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
    const day = Number(date.slice(-2))
    const month = Number(date.substring(5, 7));
    const dateString = `${day} ${months[month - 1]}`;
    return dateString;
};

const generateBeachMessage = function (weather) {
    if (main.temp > 18) {

    }
};

const renderCurrent = function (currentWeather) {
	console.log(currentWeather);

	// Generating HTML code
	const currentHTML = `
        <div class="current">

            <h1 class="current__heading">${city}</h1>

            <div class="current__description">
                <i class="current__icon-large wi wi-owm-${+currentWeather.weather[0].id}"></i>
                <p>${currentWeather.weather[0].description}</p>
            </div>

            <p class="current__message">YES! 🤩 Det ser ut att vara strandväder! 😎☀️ Spring och hämta solskrämen och brassestolen genast!</p>

            <div class="current__stats">
                <div class="current__temperature">
                    <i class="current__icon wi wi-thermometer"></i>
                    <p>${Math.round(+currentWeather.main.temp)}°</p>
                </div>
                <div class="current__wind">
                    <i class="current__icon wi wi-wind towards-${+currentWeather.wind.deg}-deg"></i>
                    <p>${Math.round(+currentWeather.wind.speed)} m/s</p>
                </div>
                <div class="current__humidity">
                    <i class="current__icon wi wi-humidity"></i>
                    <p>${+currentWeather.main.humidity} %</p>
                </div>
            </div>
        </div>
        `;

	currentWeatherElement.insertAdjacentHTML("beforeend", currentHTML);
};

const fetchWeatherData = function (city) {
	// Fetching data from API
    fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city},SE&appid=d281633f352b5e2ecf2b04cd6db53196&lang=sv&units=metric`
    )
        // Waiting for response, then convert it to JSON
        .then((response) => {
            if (!response.ok) throw new Error(`(${response.status}) Oops. Något gick visst fel... 😞 Testa att söka igen!`);
            return response.json();
        })

        // Waiting for response, then handling data
        .then((data) => {

            // Generating array of forecasts sorted by date
            const weatherArray = sortWeatherArray(data);

            // Rendering forecast data
            renderForecast(weatherArray);

            // Array with current weather data
            const currentWeather = data.list[0];

            // Rendering current weather data
            renderCurrent(currentWeather);
        })
        
        // Catching error and render it on page for user
        .catch(error => {
            renderError(error);
        });
};

// Shows an error message to the user
const renderError = function (error) {
    const errorHTML = `
    <h3 class="errormessage">${error}</h3>
    `
    resetContent();
    errorElement.insertAdjacentHTML("beforeend", errorHTML);
}

// Adds expand functionality on forecast day elements when user clicks
const addExpandFunctionality = function (elements) {
	elements.forEach((day) => {
		day.addEventListener("click", () => {
			if (day.classList.contains("active")) {
				removeActiveClasses();
			} else {
				removeActiveClasses();
				day.classList.add("active");
			}
		});
	});
};

// Removes the class "active" for all forecast elements
const removeActiveClasses = function () {
	forecastDayElements.forEach((day) => {
		day.classList.remove("active");
	});
};

// Resets the DOM content
const resetContent = function () {
    forecastElement.innerHTML = "";
    currentWeatherElement.innerHTML = "";
    errorElement.innerHTML = "";
};

// Handling search made by user
const handleSearch = function (input) {
    if (input) {
        city = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
		searchbar.value = "";
		resetContent();
		fetchWeatherData(city);
    };
};

// Add event listener for search button
searchBtn.addEventListener("click", () => {
    handleSearch(searchbar.value);
});

// Add event listener for enter key
searchbar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleSearch(searchbar.value);
        searchbar.blur();
    }
});

fetchWeatherData(city);