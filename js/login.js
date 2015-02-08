/**
 * Handler for the signin callback triggered after the user selects an account.
 */
function signinCallback(resp) {

	gapi.client.load('oauth2', 'v2', function() {
		gapi.client.oauth2.userinfo.get().execute(function(resp) {
			var access_token = resp['access_token'];
			// Shows user email
			localStorage.setItem("accessToken", access_token);
			localStorage.setItem("email", resp.email);
			localStorage.setItem("id", resp.id);
			console.log(" email in oauth2 = " + resp.email);
			console.log(JSON.stringify(localStorage));
			console.log(JSON.stringify(resp));

			if (resp.id != null && resp.id != 'undefined' && resp.id != "") {
				alert("Welcome!");
				window.open("main.html", "_self");

			} else {
				alert("Please Log in");
			}
 
		});
	});

}

function getAccessToken() {
	alert("getAccessToken");
	return localStorage.getItem("accessToken");
}

/**
 * Sets up an API call after the Google API client loads.
 */
function apiClientLoaded() {
	alert("apiClientLoaded");
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

	alert("handleEmailResponse");
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
	alert("loadFullCalendar");

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
	var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + getAccessToken();
	// Perform an asynchronous GET request.
	
	localStorage.removeItem("accessToken");
	localStorage.removeItem("email");
	localStorage.removeItem("id");
	
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
