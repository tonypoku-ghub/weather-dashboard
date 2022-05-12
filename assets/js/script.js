var searchHistoryEl = document.querySelector("#search-history");

var searchInputEl = document.querySelector("#search-input");

var weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?q={city}&appid=dff9798285dea32133f4c2c13f702b52";

var uvindexURL =
  "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=hourly,daily,minutely&appid=dff9798285dea32133f4c2c13f702b52";

async function searchWeather() {
  var searchURL = weatherURL.replace("{city}", searchInputEl.value);

  var response = await fetch(searchURL);

  var data = await response.json();
  console.log("weather: ");
  console.log(data);

  updateDashboard(data);

  logSearchHistory(searchInputEl.value);
}

async function getUVIndex(lat, lon) {
  var searchURL = uvindexURL.replace("{lat}", lat).replace("{lon}", lon);

  var response = await fetch(searchURL);

  var data = await response.json();
  console.log("One Call: ");
  console.log(data);

  return JSON.parse(data.current.uvi);
}

function updateDashboard(data) {
  $("#temp").text(data.main.temp);
  $("#wind").text(data.wind.speed + " MPH");
  $("#humidity").text(data.main.humidity + "%");

  var uvindex = getUVIndex(data.coord.lat, data.coord.lon);
  $("#uvindex").text(uvindex);
}

function logSearchHistory(inputText) {
  var newContentDiv = document.createElement("div");

  var newContent = document.createTextNode(inputText);

  newContentDiv.appendChild(newContent);

  searchHistoryEl.appendChild(newContentDiv);
}

$(function () {
  $("#btn-search").click(searchWeather);
});
