/**
   * Handler for the signin callback triggered after the user selects an account.
   */
function signinCallback(resp) {
	alert("signinCallback");
  gapi.client.load('plus', 'v1', apiClientLoaded);
  if (resp['status']['signed_in']) {
    var access_token = resp['access_token'];
    console.log(access_token);
    localStorage.setItem("accessToken", access_token);
    // go to main.html
    window.open("main.html", "_self");
  }
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
    	userId: 'me'
    	}).execute(handleEmailResponse);
    	
    	
    	
    
    
    var request2 = gapi.client.plus.people.get({
    	userId: 'me',
    	emails : 'me'
    	});
    	
    console.log("apiClientLoaded - request2 : " + JSON.stringify(request2));
    
    var request = gapi.client.plus.people.get({
    	userId: 'me'
    	});
	console.log("apiClientLoaded - request : " + JSON.stringify(request));
  }

  /**
   * Response callback for when the API client receives a response.
   *
   * @param resp The API response object with the user email and profile information.
   */
  function handleEmailResponse(resp) {
  	alert("handleEmailResponse");
  	
  	 

  	console.log("resp : " + JSON.stringify(resp)); //resp : {"G":1,"B":{"ha":null,"B":{"path":"/plus/v1/people/me","method":"GET","params":{},"headers":{},"root":"https://www.googleapis.com"},"G":"auto"}}

  	console.log("resp.emails : " + JSON.stringify(resp.emails)); // resp.emails : undefined
    var primaryEmail;
    for (var i=0; i < resp.emails.length; i++) {
      if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
    }
    //console.log(JSON.stringify(resp.emails));
	
    localStorage.setItem("email", primaryEmail);
    console.log("in handleEmailResponse function localStorage = " + JSON.stringify(localStorage));
  }
  


  

// Displays full calendar when main.html is loaded
function loadFullCalendar() {
    // load user email
    console.log("load main");
    console.log(JSON.stringify(localStorage)); // only has accessToken property
    
    var email = localStorage.getItem("email");
    
    console.log("Email = " + email);
    
    
    document.getElementById('user_email').innerHTML = "Welcome " + email;
    //Calendar
    $('#calendar').fullCalendar({
        header:{
            left:'prev, next today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay'
        },
        defaultView: 'month',
        editable: true,
        selectable: true,
        selectHelper: true,

        eventClick: function(calEvent, jsEvent, view){
            var r = confirm("Delete "+ calEvent.title);
            var e = confirm("edit "+ callEvent.title);
            if (r===true){
                calendar.fullCalendar('removeEvents', calEvent._id);        
            }else if(e==true){
                var newTitle = prompt('New event title:');
                if (newTitle) {
                    calEvent.title = newTitle;
                    calendar.fullCalendar('updateEvent', calEvent);
                }
            }   
                                                    
        },
      googleCalendarApiKey: 'AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE',
      events: {
          googleCalendarId: email,
          color: 'yellow',
          textColor:'black'
      }
    });

}







// Logs out user by invalidating the access token
function logout() {
  var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + getAccessToken();

  // Perform an asynchronous GET request.
  $.ajax({
    type: 'GET',
    url: revokeUrl,
    async: false,
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(nullResponse) {
      window.open("login.html", "_self");
    },
    error: function(e) {
      // Handle the error
      // console.log(e);
    }
  });
}
