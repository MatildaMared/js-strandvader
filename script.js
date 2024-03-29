// DOM elements
const forecastElement = document.querySelector(".weather__forecast-wrapper");
const currentWeatherElement = document.querySelector(".weather__current-wrapper");
let forecastDayElements = "";
const searchbar = document.querySelector(".header__searchbar");
const searchBtn = document.querySelector(".header__searchbtn");
const errorElement = document.querySelector(".error");

// Initial city used to display forecast
let city = "Tylösand";

// Sorting data based on date and returning a new array
const sortWeatherArray = function (data) {
	const weatherArray = [[], [], [], [], [], []];
	console.log(weatherArray);
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

// Create and display the forecast
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
            <section class="forecast">
                <article class="forecast__time">
                    <i class="wi wi-time-${time}"></i>
                    <p>${time}:00</p>
                </article>
                <article class="forecast__description">
                    <i class="wi wi-owm-${timeOfDay}-${+forecastTime.weather[0].id}"></i>
                    <p>${forecastTime.weather[0].description}</p>
                </article>
                <article class="forecast__temperature">
                    <i class="wi wi-thermometer"></i>
                    <p>${Math.round(+forecastTime.main.temp)}°</p>
                </article>
                <article class="forecast__wind">
                    <i class="wi wi-wind towards-${+forecastTime.wind.deg}-deg"></i>
                    <p>${Math.round(+forecastTime.wind.speed)} m/s</p>
                </article>
            </section>
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
	const months = [
		"januari",
		"februari",
		"mars",
		"april",
		"maj",
		"juni",
		"juli",
		"augusti",
		"september",
		"oktober",
		"november",
		"december",
	];
	const day = Number(date.slice(-2));
	const month = Number(date.substring(5, 7));
	const dateString = `${day} ${months[month - 1]}`;
	return dateString;
};

// Generates a message string based on current weather
const generateBeachMessage = function (weather) {
	let message = "";
	const temp = weather.main.temp;
	const windSpeed = weather.wind.speed;
	const description = weather.weather[0].description;

	if (temp > 20 && windSpeed <= 5 && description === "klar himmel") {
		message =
			"WOW! 🤩 Vilket strandväder, det kan knappast bli bättre än så här! Hämta brassestolarna och solkrämen genast, beachen väntar ju! 😎☀️";
	} else if (
		temp > 18 &&
		windSpeed <= 7 &&
		(description === "klar himmel" ||
			description === "lätt molnighet" ||
			description === "växlande molnighet")
	) {
		message =
			"Det ser ut att bli en riktigt fin dag! ☀️ Dags att packa strandväskan kanske? Ta med dig en bra bok eller tidning och glöm för guds skull inte vattnet, det är viktigt med vätska i värmen! 💦😄";
	} else {
		message =
			"Det verkar tyvärr inte som att det blir något strandväder idag... 😞 Men häng inte läpp för det, det finns mängder av andra roliga saker att hitta på! Sen går det förstås bra att åka till stranden oavsett väder, men hoppa i plurret på egen risk! 🥶";
	}
	return message;
};

// Create elements and display the current weather
const renderCurrent = function (currentWeather) {
	const message = generateBeachMessage(currentWeather);

	// Generating HTML code
	const currentHTML = `
        <section class="current">
            <h1 class="current__heading">${city}</h1>
            <article class="current__description">
                <i class="current__icon-large wi wi-owm-${+currentWeather.weather[0].id}"></i>
                <p>${currentWeather.weather[0].description}</p>
            </article>
            <p class="current__message">${message}</p>
            <article class="current__stats">
                <article class="current__temperature">
                    <i class="current__icon wi wi-thermometer"></i>
                    <p>${Math.round(+currentWeather.main.temp)}°</p>
                </article>
                <article class="current__wind">
                    <i class="current__icon wi wi-wind towards-${+currentWeather.wind.deg}-deg"></i>
                    <p>${Math.round(+currentWeather.wind.speed)} m/s</p>
                </article>
                <article class="current__humidity">
                    <i class="current__icon wi wi-humidity"></i>
                    <p>${+currentWeather.main.humidity} %</p>
                </article>
            </article>
        </section>
        `;

	currentWeatherElement.insertAdjacentHTML("beforeend", currentHTML);
};

const fetchWeatherData = async function (city) {
	try {
		// Fetching data from API
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${city},SE&appid=d281633f352b5e2ecf2b04cd6db53196&lang=sv&units=metric`
		);
		if (!response.ok) {
			throw new Error(`(${response.status}) Oops. Något gick visst fel... 😞 Testa att söka igen!`);
		}
		const data = await response.json();
		// Create array of forecasts sorted by date
		const weatherArray = sortWeatherArray(data);

		// Display forecast data
		renderForecast(weatherArray);

		// Create array of current weather data
		const currentWeather = data.list[0];

		// Display current weather data
		renderCurrent(currentWeather);
	} catch (error) {
		// Catching error and render it on page for user
		renderError(error);
	}
};

// Displays error message on webpage
const renderError = function (error) {
	const errorHTML = `
    <h3 class="errormessage">${error}</h3>
    `;
	resetContent();
	errorElement.insertAdjacentHTML("beforeend", errorHTML);
};

// Adds expand functionality on forecast day elements when user clicks on date
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

// Removes class "active" for all forecast elements
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
		city = input.trim();
		city = city.charAt(0).toUpperCase().trim() + city.slice(1).toLowerCase();
		searchbar.value = "";
		resetContent();
		fetchWeatherData(city);
	}
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
