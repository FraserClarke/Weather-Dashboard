/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
*/

//local storage example: city: ["paris", "london", "sydney"]


//on click function getting users input
$(document).ready(function() {
	var searchedCities = JSON.parse(localStorage.getItem("cities")) || []; 	

	//function that intiialises when the page loads, if no cities searched displaying none
	init()

	function init(){
		if (searchedCities.length > 0){
			searchCityWeather(searchedCities[searchedCities.length-1])
		}
		$("#previousSearches ul").empty();
		renderCities(searchedCities)
	}
	//clearing functions so they dont repeat on html.... add others relevent
	function clear(){
		$(".displayTemp").empty();
		$(".displayHumid").empty();
		$(".displayIndex").empty();
	}
	//for loop, going through the array, getting last searched city
	function renderCities(cities){
		for (var i = cities.length - 1; i >= 0; i--) {
			makeRow(cities[i]);
		}


		// when page loads we want to get ls items
		// loop thorugh the array 
		// each item in array needs to be a separate li
		// each li need to be appended to ul
		// ul needs to be created and appened to the div with id previousSearches
	}  
	//creating list for cities searched
	function makeRow(city){
		var li = $("<li>");
		li.text(city);
		$("#previousSearches ul").append(li);
	}
	


	//need onclick event
	$("#citySearchBtn").on("click", grabInput)

	//grab city name 
	function grabInput(){
	
		var city = $("#cityName").val();
		// if city is empty     === empty set "" ....empty string
		// alter city cannot be empty
		searchCityWeather(city);
	}
    //searching api, gathering data
	function searchCityWeather(city){
		clear()
		saveCityToLS(city);
		makeRow(city)                                      //using back tick,Template literals/strings
		var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=+${city}+&appid=5112d0108f86dc264863990862ea0d1c`
		// console.log(queryURL);
		$.ajax({
			type: "GET",
			url: queryURL,
			dataType: "json",
			success: function(response){
				console.log(response)
                //gathering temperature data converting it from kelvin to celcius
                var temp = parseInt(response.main.temp)-273.15;
				console.log(Math.round(temp * 100) / 100+ " °C");
                //adding humidity to the html, displaying
                //var humid = $("<p>").addClass("weather-text").val(response.main.humidity) ;
                var humid = parseInt(response.main.humidity) ;
				console.log(humid);

				$(".displayHumid").append(humid);
                //$(".display").append(temp);
                var temp = "Temperature: " + (Math.round(temp * 100) / 100+ " °C");
                $(".displayTemp").append(temp);
            
                var windSpeed = parseInt(response.wind.speed);
                console.log(windSpeed * 1.609);
                //multiply the speed value by 1.609
                var windSpeed = ((windSpeed * 1.609)).toFixed(2);
                $(".displaySpeed").append(windSpeed);
				// query URL for uv index + ajax
		             //function lat + long 
                var lon = response.coord.lon;
                var lat = response.coord.lat;

                var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=5112d0108f86dc264863990862ea0d1c&lat=${lat}&lon=${lon}`
		        // console.log(queryURL);
		        $.ajax({
					type: "GET",
					url: queryURL,
					dataType: "json",
					success: function(response){
						var uvIndex = response.value;
						$(".displayIndex").append(uvIndex);
                    
                }
		        //          5 day forecast query URL + ajax
		        // var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5112d0108f86dc264863990862ea0d1c&units=imperial`
   			 	})
            }
							
		})
      
    }
    
    
	//function pushing cities into the array, local storage
	function saveCityToLS(cityName){
		if (searchedCities.indexOf(cityName) === -1) {
			searchedCities.push(cityName);
			localStorage.setItem("cities", JSON.stringify(searchedCities))
		}
	}                	         
})

	//need ajax function, get data for
	// current condition
	//build skeleton html
	//ajax call for the city
	//look at the response
	//log relevant values 
	//append values into the DOM

	// 5 day forecast with 5 cards 

	// and future conditions

	// Block 1 top
	// -city name, the date, an icon representation of weather conditions, 
	// the temperature, the humidity, the wind speed, and the UV index
	// Block 2 Below
	// -5 day forecast + conditions
	// -uv index icon
	// Block 3 Left
	// =Search funtion Displaying city names
	// -onlcik event
	// -icons

	// Need function to convert kelvin to celcius

            

