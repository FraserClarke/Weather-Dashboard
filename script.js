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
		console.log(city);                                       //using back tick,Template literals/strings
		var queryURL = `http://api.openweathermap.org/data/2.5/weather?q=+${city}+&appid=5112d0108f86dc264863990862ea0d1c`
		console.log(queryURL);
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
				var humid = $("<p>").addClass("weather-text").text(`Humidity: ${response.main.humidity} %`);
				console.log(humid);

				$(".display").append(humid);

				var temp;


				// query URL for uv index + ajax
				// var uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=5112d0108f86dc264863990862ea0d1c&lat="+${lat}+"&lon="+${long},`


				//5 day forecast query URL + ajax
				// var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5112d0108f86dc264863990862ea0d1c&units=imperial`

			}
		})

	}





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

})


