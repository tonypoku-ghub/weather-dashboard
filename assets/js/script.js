var searchHistoryEl = document.querySelector("#search-history");

var searchInputEl = document.querySelector("#search-input");

var weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?q={city}&appid=dff9798285dea32133f4c2c13f702b52";

var uvindexURL =
  "https://api.openweathermap.org/data/2.5/onecall?units=standard&lat={lat}&lon={lon}&exclude=hourly,daily,minutely&appid=dff9798285dea32133f4c2c13f702b52";

function searchWeather() {
  var searchURL = weatherURL.replace("{city}", searchInputEl.value);

  fetch(searchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log("weather: ");
      console.log(data);

      updateDashboard(data);

      logSearchHistory(searchInputEl.value);
    });
}

function setUVIndex(lat, lon) {
  var searchURL = uvindexURL.replace("{lat}", lat).replace("{lon}", lon);

  fetch(searchURL)
    .then((response) => response.json())
    .then((data) => {
      console.log("One Call: ");
      console.log(data);

      debugger;

      var uvindex = data.current.uvi;

      console.log("uvindex: ");
      console.log(uvindex);

      $("#uvindex").text(uvindex);
    });
}

function updateDashboard(data) {
  $("#temp").text(data.main.temp);
  $("#wind").text(data.wind.speed + " MPH");
  $("#humidity").text(data.main.humidity + "%");

  setUVIndex(data.coord.lat, data.coord.lon);
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
