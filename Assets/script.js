
// ACCEPTANCE CRITERIA

// GIVEN a weather dashboard with form inputs

// Global variables
var cities = [];
var cityForm=document.querySelector("#citySearchForm");
var cityInput=document.querySelector("#city");
var weatherContainer=document.querySelector("#currentWeatherContainer");
var citySearchInput = document.querySelector("#searchedCity");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveDayContainer");
var pastSearchButton = document.querySelector("#pastSearchBtns");

// WHEN I search for a city
var formSumbit = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City");
    }
    saveSearch();
    pastSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

var getCityWeather = function(city){
    var apiKey = "2c2db1c6289e805f990489210fa04569";
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

// THEN I am presented with current and future conditions for that city and that city is added to the search history
var displayWeather = function(weather, searchCity){
    //Old content
    weatherContainer.textContent= "";  
    citySearchInput.textContent=searchCity;

    //Date element
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);

   //Image element
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherIcon);

   //Temperature data
   var temperature = document.createElement("span");
   temperature.textContent = "Temperature: " + weather.main.temp + " °F";
   temperature.classList = "list-group-item"
  
   //Humidity data
   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "list-group-item"

   //Wind data
   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeed.classList = "list-group-item"

// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
    weatherContainer.appendChild(temperature);
    weatherContainer.appendChild(humidity);
    weatherContainer.appendChild(windSpeed);
 
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
}

// WHEN I view the UV index
var getUvIndex = function(lat,lon){
    var apiKey = "2c2db1c6289e805f990489210fa04569";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}

// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
var displayUvIndex = function(index){
    var uvIndex = document.createElement("div");
    uvIndex.textContent = "UV Index: "
    uvIndex.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndex.appendChild(uvIndexValue);

    //append to current weather
    weatherContainer.appendChild(uvIndex);
}

// WHEN I view future weather conditions for that city
var get5Day = function(city){
    var apiKey = "2c2db1c6289e805f990489210fa04569";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
var display5Day = function(weather){
    forecastContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
       for(var i = 5; i < forecast.length; i = i + 8){
       var dailyForecast = forecast[i];
        
       
       var forecast=document.createElement("div");
       forecast.classList = "card bg-primary text-light m-2";

       console.log(dailyForecast)


       //Date element
       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecast.appendChild(forecastDate);

       //Image element
       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecast.appendChild(weatherIcon);
       
       //Temperature
       var forecastTemp=document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent = "Temp: " + dailyForecast.main.temp + " °F";

       //append to forecast card
        forecast.appendChild(forecastTemp);

       //Wind Speed
    //    var forecastWindSpeed=document.createElement("span");
    //    forecastWindSpeed.classList = "card-body text-center";
    //    forecastWindSpeed.textContent = "Wind: " + dailyForecast.main.wind.speed + " MPH";

       //append to forecast card
    //    forecast.appendChild(forecastWindSpeed);

       //Humidity
       var forecastHum=document.createElement("span");
       forecastHum.classList = "card-body text-center";
       forecastHum.textContent = "Hum: " + dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecast.appendChild(forecastHum);

       //append to five day container
        forecastContainer.appendChild(forecast);
    }
}

// WHEN I click on a city in the search history
var pastSearch = function(pastSearch){

    pastSearchElement = document.createElement("button");
    pastSearchElement.textContent = pastSearch;
    pastSearchElement.classList = "d-flex w-100 btn-light border p-2";
    pastSearchElement.setAttribute("data-city",pastSearch)
    pastSearchElement.setAttribute("type", "submit");

    pastSearchButton.prepend(pastSearchElement);
}

// THEN I am again presented with current and future conditions for that city
var pastSearchHandle = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

cityForm.addEventListener("submit", formSumbit);
pastSearchButton.addEventListener("click", pastSearchHandle);
