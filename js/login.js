/**
   * Handler for the signin callback triggered after the user selects an account.
   */
function signinCallback(resp) {
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
  return localStorage.getItem("accessToken");
}
  /**
   * Sets up an API call after the Google API client loads.
   */
  function apiClientLoaded() {
    gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
  }

  /**
   * Response callback for when the API client receives a response.
   *
   * @param resp The API response object with the user email and profile information.
   */
  function handleEmailResponse(resp) {
    var primaryEmail;
    for (var i=0; i < resp.emails.length; i++) {
      if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
    }

    localStorage.setItem("email", primaryEmail);
  }
  


  

// Displays full calendar when main.html is loaded
function loadFullCalendar() {
    // load user email
    console.log("load main");
    
    var email = localStorage.getItem("email");
    
    console.log("email = " + email);
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
