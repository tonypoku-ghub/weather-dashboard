var search_history_array = [];

var searchHistoryEl = document.querySelector("#search-history");

var searchInputEl = document.querySelector("#search-input");

var weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?units=imperial&q={city}&appid=dff9798285dea32133f4c2c13f702b52";

var uvindexURL =
  "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat={lat}&lon={lon}&exclude=hourly,daily,minutely,alerts&appid=dff9798285dea32133f4c2c13f702b52";

var dailyURL =
  "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat={lat}&lon={lon}&exclude=hourly,minutely,current,alerts&appid=dff9798285dea32133f4c2c13f702b52";

function searchWeatherFromInput() {
  searchWeather(searchInputEl.value);
}

function searchWeatherFromHistory() {
  searchWeather($(this).attr("id"));
}

async function searchWeather(city) {
  city = city.toUpperCase();
  var searchURL = weatherURL.replace("{city}", city);
  var response = await fetch(searchURL);

  var data = await response.json();
  console.log("weather: ");
  console.log(data);

  updateDashboard(city, data);

  logSearchHistory(city);

  saveToLocalStorage(city);
}

async function getUVIndex(lat, lon) {
  var searchURL = uvindexURL.replace("{lat}", lat).replace("{lon}", lon);

  var response = await fetch(searchURL);

  var data = await response.json();
  console.log("One Call - Current: ");
  console.log(data);

  return data.current.uvi;
}

async function updateDashboard(city, data) {
  var color_class = "green";

  $("#temp").text(data.main.temp + " °F");
  $("#wind").text(data.wind.speed + " MPH");
  $("#humidity").text(data.main.humidity + " %");

  var uvindex = await getUVIndex(data.coord.lat, data.coord.lon);

  if (uvindex <= 2) {
    color_class = "green";
  } else if (uvindex < 5) {
    color_class = "yellow";
  } else if (uvindex < 7) {
    color_class = "orange";
  } else if (uvindex < 10) {
    color_class = "red";
  }

  $("#uvindex")
    .text(uvindex)
    .css("background-color", color_class)
    .addClass("px-3");

  var daily = await getDailyForecast(data.coord.lat, data.coord.lon);

  // Update header with city name
  $("#city_header")
    .css("font-weight", "bold")
    .text(city + moment.unix(data.dt).format("(MM/DD/YYYY)"));

  // Remove old cards
  $("#city-5-day").empty();

  daily.forEach((day, index) => {
    if (index < 5) {
      var dt = moment.unix(day.dt).format("MM/DD/YYYY");
      var temp = day.temp.day;
      var wind = day.wind_speed;
      var humidity = day.humidity;
      var icon = day.weather[0].icon;

      addWeatherCard(dt, temp, wind, humidity, icon);
    }
  });
}

function addWeatherCard(date, temp, wind, humidity, icon) {
  var cardDiv = $("<div>").addClass("card w-25 m-2");

  var cardHeaderDiv = $("<div>")
    .addClass("card-header")
    .text(date)
    .css("font-weight", "bold");

  var cardImageDiv = $("<img>")
    .addClass("card-img-top")
    .attr("alt", "icon")
    .attr(
      "src",
      "http://openweathermap.org/img/wn/{icon}@2x.png".replace("{icon}", icon)
    );

  var cardTempDiv = $("<div>")
    .addClass("card-body border")
    .text("Temp: " + temp + " °F");

  var cardWindDiv = $("<div>")
    .addClass("card-body border")
    .text("Wind: " + wind + " MPH");

  var cardHumidityDiv = $("<div>")
    .addClass("card-body border")
    .text("Humidity: " + humidity + " %");

  cardDiv.append(
    cardHeaderDiv,
    cardImageDiv,
    cardTempDiv,
    cardWindDiv,
    cardHumidityDiv
  );

  var cardEl = $("#city-5-day").append(cardDiv);
}

async function getDailyForecast(lat, lon) {
  var searchURL = dailyURL.replace("{lat}", lat).replace("{lon}", lon);

  var response = await fetch(searchURL);

  var data = await response.json();
  console.log("One Call - Daily: ");
  console.log(data);

  return data.daily;
}

function logSearchHistory(city) {
  var newContentBtn = $("<button>")
    .attr("type", "button")
    .attr("id", city)
    .addClass("btn btn-secondary m-2")
    .text(city);

  newContentBtn.on("click", searchWeatherFromHistory);

  // Remove element if it already exists
  $(searchHistoryEl)
    .find("#" + city)
    .remove();

  $(searchHistoryEl).prepend(newContentBtn);
}

$(function () {
  $("#btn-search").click(searchWeatherFromInput);

  doInit();
});

function saveToLocalStorage(city) {
  var elementIndex = $.inArray(city, search_history_array);

  if (elementIndex > -1) {
    search_history_array.splice(elementIndex, 1);
  }

  search_history_array.push(city);

  localStorage.setItem(
    "weather-search-history",
    JSON.stringify(search_history_array)
  );
}

function doInit() {
  search_history_array = JSON.parse(
    localStorage.getItem("weather-search-history")
  );

  if (!search_history_array) {
    search_history_array = [];
  }

  search_history_array.forEach((city) => {
    logSearchHistory(city);
  });
}
