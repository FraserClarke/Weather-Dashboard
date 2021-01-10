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
        $(".DisplayName").empty();
        $(".DisplayTodaysDate").empty();
		$(".displayTemp").empty();
		$(".displayHumid").empty();
        $(".displayIndex").empty();
        $(".displaySpeed").empty();
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
    
    $("#previousSearches ul").on("click", "li", function(){
        searchCityWeather($(this).text());
    })


	//need onclick event
	$("#citySearchBtn").on("click", grabInput)

	//grab city name 
	function grabInput(){
	
		var city = $("#cityName").val();
		// if city is empty     === empty set "" ....empty string
		// alter city cannot be empty
		searchCityWeather(city);
	}
    //searching api, gathering data CURRENT DAY AJAX
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

				$(".displayHumid").append("humidity: " + humid + "%");
                //$(".display").append(temp);
                var temp = "Temperature: " + (Math.round(temp * 100) / 100+ " °C");
                $(".displayTemp").append(temp);
            
                var windSpeed = parseInt(response.wind.speed);
                console.log(windSpeed * 1.609);
                //multiply the speed value by 1.609
                var windSpeed = "Wind Speed: " + ((windSpeed * 1.609)).toFixed(2) + " Km/h";
                $(".displaySpeed").append(windSpeed);

                

                //Display city name
                
                
                var cityDisplay = (response.name + " ");
                console.log(cityDisplay);
                $(".DisplayName").append(cityDisplay);
                
                var TodaysDate = moment().format('L');
                $('.DisplayTodaysDate').append(TodaysDate);
                
                //Display Icon

                var displayIcon = (response.weather[0].icon);
                console.log(displayIcon);
                var iconCard = `<img src= ${`http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`} /img>`;
                //$('<img>').attr('src', ${`http://openweathermap.org/img/wn/$
                $('.DisplayTodayIcon').append(iconCard);
                //http://openweathermap.org/img/wn/10d@2x.png
                // query URL for UV INDEX + ajax
		             //function lat + long 
                var lon = response.coord.lon;
                var lat = response.coord.lat;

                var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=5112d0108f86dc264863990862ea0d1c&lat=${lat}&lon=${lon}`
		         console.log(queryURL);
		        $.ajax({
					type: "GET",
					url: queryURL,
					dataType: "json",
					success: function(response){
                        //Color---Favourable /Moderate / Severe
                        //low 0-2 green
                        //moderate 3-5 yellow
                        //high 6-7 orange
                        //very high 8-10 red
                        //extreme 11+ violet
                        console.log(response);
                        var uvIndex = response.value;
						$(".displayIndex").append("Uv Index: " + uvIndex);
                        console.log(uvIndex);
                        
                        // if uvIndex >= 0 node.style.color = 'green'
                        // else uvIndex >= 3 node.style.color= 'yellow'
                        // else uvIndex >= 6
                        // else uvIndex >= 8
                        // else uvindex >= 11
                        //if (uvIndex > 0 || = 2 ) {
                        if (uvIndex > 0 && uvIndex < 2 ) {
                            $("#uvColor").addClass('low');
                        }
                        else if (uvIndex > 3 && uvIndex < 5 ) {
                            $("#uvColor").addClass('moderate');
                        }
                        else if (uvIndex > 6 && uvIndex < 7) {
                            $("#uvColor").addClass('high');
                        }
                        else if (uvIndex > 8 && uvIndex < 10 ) {
                            $("#uvColor").addClass('vHigh');
                        }
                        else if (uvIndex >= 11) {
                            $("#uvColor").addClass('extreme');
                        }
                        // 
                        // $("#uvColor").addClass('high');
                        // $("#uvColor").addClass('very high');
                        // $("#uvColor").addClass('extreme');
                        
                        
                    }
		        
               
                })
                            //          5 day FORECAST query URL + ajax
                            // var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5112d0108f86dc264863990862ea0d1c&units=imperial`
                            //api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
                        //var city
                //var city=cityName;
                var forecastURL = //`http://api.openweathermap.org/data/2.5/forecast?q=+${city}&appid=5112d0108f86dc264863990862ea0d1c&units=imperial`
                `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5112d0108f86dc264863990862ea0d1c`
                console.log(forecastURL);
                    $.ajax({
                        type: "GET",
                        url: forecastURL,
                        dataType: "json",
                        //display Date, Icon, Temp Humdidity
                        success: function(response){
                            console.log(response);
                            $("#temp").empty();
                            
                            //3, 11, goes up by + 8. Need list for. [3],[7],[11],[19],[27] 
                            // for var = i 3 + 8????
                            //ISSUE HERE , NEED CORRECT DATE had i=4, changed to 8, displays 4 not five, not long enough
                            for ( var i = 0; i < response.list.length; i++) {   // or i +=8
                                console.log(response.list[i]); //minus 3???
                            //Get from array index number 3, as it represents 12:00pm
                                //parseInt()??????
                                //for loop var i = list???
                                console.log(response.list[i].dt_txt.indexOf("03:00:00"))
                                if (response.list[i].dt_txt.indexOf("03:00:00") > -1){
                                    console.log("text----------")
                                     var forecastCallDate = response.list[i].dt_txt;
                                     forecastCallDate = forecastCallDate.slice(0,10);
                                    var forecastCallTemp = parseInt(response.list[i].main.temp)-273.15;
                                    console.log(Math.round(forecastCallTemp * 100) / 100+ " °C");
                                    var forecastCallHumidity = response.list[i].main.humidity;
                                    console.log(forecastCallHumidity);
                                    var forecastCallIcon = response.list[i].weather[0].icon
                                    console.log(forecastCallIcon);  

                                     var card1 = `<div class='col-md-2.5'>
                                    <h4> ${forecastCallDate} </h4>
                                    <img src= ${`http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png`} /img>
                                    <p> Temperature : ${forecastCallTemp.toFixed(2)}°C 
                                    <p> Humidity : ${response.list[i].main.humidity}%                               
                                    </div>`;
                                    
                                    $("#temp").append(card1);
                                }
                                                    
                                //$(".forecastTempZero").append(Math.round(response.list[i].main.temp));
                                   //  Trying to grab The information from array objects ive created and eppend them to
                                   //  correct class/id's in html. eg, zero one two three etc
                                //$(".forecastTempZero").append(array[0]) //object???
                               // $(".forecastTempZero").append(forecastCallDate); //doesnt work have to create html
                               //.empty();
                                    //<p> Temperature : ${response.list[i].main.temp};
                                //using backticks to create h1, p tags to create a new card
                                //`http://openweathermap.org/img/wn/${forecast.response.list[i].weather[0].icon}@2x.png`    //or icon?
                                
                            //var card = $('div').append(response.list[i].main.temp);
                            // variable to create the card and plug in the values you want from the response
                            // and then append that variable to an element on the html page and it will plug the card in
                            
                            //  use ${variablename} to plug in the names of the data


                            //06/01/21
                            //Get icon data for Uv index, forecast. Icon...img
                            //Get rid of time in forecastcalldate
                            //Add percentage and degress C to forecast
                            //Add css, appropriate layout, text, colors etc
                            //fix list display
                            //arrange forecast columns
                            //09/01/21
                            //Fix times....sometimes +3 or 6
                            //CITY NAME NEXT TO DATE IN TODAY TEMP
                            //Delete time in date display
                            //add css....layout, colors
                            //fix list.... add buttons

                                


                        }}
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

            

//     var queryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=5112d0108f86dc264863990862ea0d1c&lat=${lat}&lon=${lon}`
//     // console.log(queryURL);
//     $.ajax({
//         type: "GET",
//         url: queryURL,
//         dataType: "json",
//         success: function(response){
//             var uvIndex = response.value;
//             $(".displayIndex").append(uvIndex);
        
//     }
//     //          5 day forecast query URL + ajax
//     // var forecastURL = `http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=5112d0108f86dc264863990862ea0d1c&units=imperial`
//         })
// }
                
// })

// }