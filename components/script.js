// Declaring variables
let searchInputEl = document.getElementById("search-input");
let searchButtonEl = document.getElementById("search-button");
let cityNameEl = document.getElementById("city-name");
let searchHistoryEl = document.getElementById("history-results");

let temperatureEls = [
  document.getElementById("temp"),
  document.getElementById("temp2"),
  document.getElementById("temp3"),
  document.getElementById("temp4"),
  document.getElementById("temp5"),
];

let humidEls = [
  document.getElementById("humid"),
  document.getElementById("humid2"),
  document.getElementById("humid3"),
  document.getElementById("humid4"),
  document.getElementById("humid5"),
];

let windEls = [
  document.getElementById("wind"),
  document.getElementById("wind2"),
  document.getElementById("wind3"),
  document.getElementById("wind4"),
  document.getElementById("wind5"),
];

let weatherIconEls = [
  document.getElementById("weather-icon"),
  document.getElementById("weather-icon2"),
  document.getElementById("weather-icon3"),
  document.getElementById("weather-icon4"),
  document.getElementById("weather-icon5"),
];

let indexs = [0, 7, 15, 23, 31, 39];

let apiKey = "550f01e8cf456a25abbd44843c13ad2a";
let cities = [];
let city_history = [];
let temps = [5];
let humids = [5];
let winds = [5];
let dates = [5];

function getLocation(city) {
  console.log("hello");
  let locationUrl =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&appid=" +
    apiKey;

  fetch(locationUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data[0]);
      console.log(data[0].name);

      let lat = data[0].lat;
      let lon = data[0].lon;
      getWeather(lat, lon);
      
      // Gets the city from search
      //input and sends city to the city-name
      // id inside of the html file
      cityNameEl.innerHTML = city;
    });
}

function getWeather(lat, lon) {
  let weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeather(data);
    });
}

function displayWeather(data) {
  console.log(data);

  for (let i = 0; i < 5; i++) {
    temps[i] = data.list[indexs[i]].main.temp;
    humids[i] = data.list[indexs[i]].main.humidity;
    winds[i] = data.list[indexs[i]].wind.speed;
    dates[i] = new Date(data.list[indexs[i]].dt * 1000);
  }

  for (let i = 0; i < 4; i++) {
    cities.push(data.list[i]);
  }

  for (let j = 0; j < 5; j++) {
    temperatureEls[j].textContent =
      "Temperature: " + (((temps[j] - 273.15) * 9) / 5 + 32).toFixed(0) + "°F";
    humidEls[j].textContent = "Humidity: " + humids[j] + "%";
    windEls[j].textContent =
      "Wind Speed: " + (winds[j] * 2.23694).toFixed(2) + "mph";
    weatherIconEls[
      j
    ].src = `https://openweathermap.org/img/w/${data.list[j].weather[0].icon}.png`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  searchButtonEl.onclick = function () {
    var searchInput = searchInputEl.value;
    getLocation(searchInput);

    if (city_history.length < 1) {
      console.log(city_history);
      city_history.unshift(searchInput);
      
    } else {
      city_history.length = city_history.length < 3;
      city_history.unshift(searchInput);
    }

    printCityHistory();
    updateCityHistory(searchInput);
  };

  let history_results =
    JSON.parse(localStorage.getItem("history-results")) || [];
    
  const searchHistoryEl = document.getElementById("history-results");
  // This function prints the city history on the page, with each city as a button that can be clicked to retrieve the weather data
  function printCityHistory() {
    searchHistoryEl.innerHTML = ""; // Clear the previous content

    for (let i = 0; i < history_results.length; i++) {
      const city = history_results[i];
      console.log(city)
      // Create a list item and a button element
      const listItem = document.createElement("li");
      const button = document.createElement("button");

      // Set the id and text content of the button

      button.textContent = city;

      // Add a click event listener to the button
      button.addEventListener("click", function () {
        getLocation(city);
      });

      // Append the button to the list item, and the list item to the city history element
      listItem.appendChild(button);
      searchHistoryEl.appendChild(listItem);
    }
  }

  

  // This function updates the city history in local storage with the user's search input and calls the "printCityHistory" function to update the city history on the page
  function updateCityHistory(searchInput) {
    history_results.unshift(searchInput); // Add the new searchInput to the beginning of the array
    if (history_results.length > 3) {
      history_results.pop(); // Remove the last item if there are more than 3 items
    }
    localStorage.setItem("history_results", JSON.stringify(history_results));
    printCityHistory();
  }

  // Load city history on page load
  printCityHistory();
});