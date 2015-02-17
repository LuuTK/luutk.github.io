/**
 * Handler for the signin callback triggered after the user selects an account.
 */
function signinCallback(resp) {



	gapi.client.load('plus', 'v1', apiClientLoaded);
	if (resp['status']['signed_in']) {
		var access_token = resp['access_token'];
		console.log("access token = " + access_token);
		localStorage.setItem("accessToken", access_token);
		console.log("Access Token = " + access_token);
		//alert("getAccessToken() = " + access_token);
	}

	gapi.client.load('oauth2', 'v2', function() {
		gapi.client.oauth2.userinfo.get().execute(function(resp) {
			var access_token = resp['access_token'];
			// Shows user email
			localStorage.setItem("email", resp.email);
			localStorage.setItem("id", resp.id);

			console.log(JSON.stringify(resp));
			console.log(" email in oauth2 = " + resp.email);
			console.log(JSON.stringify(localStorage));
			console.log(JSON.stringify(resp));

			if (localStorage.getItem("id") != "" && localStorage.getItem("id") != null && localStorage.getItem("id") != 'undefined') {
				//alert("Welcome!");
				window.open("main.html", "_self");

			} else {
				//alert("Please Log in");
			}

		});
	});

}

function getAccessToken() {

	return "token";
}

/**
 * Sets up an API call after the Google API client loads.
 */
function apiClientLoaded() {
	//alert("apiClientLoaded");
	gapi.client.plus.people.get({
		userId : 'me'
	}).execute(handleEmailResponse);
}

/**
 * Response callback for when the API client receives a response.
 *
 * @param resp The API response object with the user email and profile information.
 */
function handleEmailResponse(resp) {

	//alert("handleEmailResponse");
	var primaryEmail;
	console.log("resp = " + JSON.stringify(resp));
	//console.log("localStorage = " + JSON.stringify(localStorage));
	//console.log("resp = " + JSON.stringify(resp));

	//for (var i=0; i < resp.emails.length; i++) {
	//  if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
	//}
	//localStorage.setItem("email", primaryEmail);
	//console.log("localStorage = " + JSON.stringify(localStorage));

}

// Displays full calendar when main.html is loaded
function loadFullCalendar() {
	//alert("loadFullCalendar");

	console.log("load main");
	console.log("localStorage = " + JSON.stringify(localStorage));

	// page is now ready, initialize the calendar...
	var email = localStorage.getItem("email");

	document.getElementById('user_email').innerHTML = "Welcome " + email;
	$('#calendar').fullCalendar({
		googleCalendarApiKey : 'AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE',
		events : {
			googleCalendarId : email
		}
	});
}

// Logs out user by invalidating the access token
function logout() {
	var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + localStorage.getItem("accessToken");
	// Perform an asynchronous GET request.
	alert("logging out");
	localStorage.removeItem("accessToken");
	localStorage.removeItem("email");
	localStorage.removeItem("id");
	console.log(JSON.stringify(localStorage));

	$.ajax({
		type : 'GET',
		url : revokeUrl,
		async : false,
		contentType : "application/json",
		dataType : 'jsonp',
		success : function(nullResponse) {
			window.open("login.html", "_self");
		},
		error : function(e) {
			// Handle the error
			// console.log(e);
		}
	});
}


 function getWeather() {
 	var input_location = document.getElementById("weather_location").value;
    var url1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"
    var url2 = input_location;
    var url3 = "%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    var url = url1+url2+url3;
    console.log(input_location);

    $.ajax({
      dataType: "json",
      url: url,
      success: function(response) {

      	if(response.query.results.channel.wind != null && response.query.results.channel.units != null){
      	 var wind = response.query.results.channel.wind;
        var channel = response.query.results.channel;
        var units = response.query.results.channel.units;	
            document.getElementById('weather_temperature').innerHTML = "Temperature : " + wind.chill;
    		document.getElementById('weather_title').innerHTML = "Location Title : " + channel.title;
    		document.getElementById('weather_description').innerHTML = "Location Description : " + channel.description;
    		document.getElementById('weather_wind_speed').innerHTML = "Wind Speed : " + wind.speed;
      	}else{
      		alert("Invalid City!");
      	}
       

        console.log("wind : " + wind);
        console.log("channel : " + channel);
        console.log("units : " + units);
 

      }
    });
}


