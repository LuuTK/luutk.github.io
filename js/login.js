var access_token;
// var primaryEmail;
// function signinCallback(authResult) {
//     if (authResult['status']['signed_in']) {
//         access_token = authResult['access_token'];
//         alert(access_token);
//         localStorage.setItem("accessToken", access_token);
//         signinSuccess(true);

// }

/**
   * Handler for the signin callback triggered after the user selects an account.
   */
function signinCallback(resp) {
    gapi.client.load('plus', 'v1', apiClientLoaded);
    if (resp['status']['signed_in']) {
        access_token = resp['access_token'];
        // alert(access_token);
        localStorage.setItem("accessToken", access_token);
        signinSuccess(true);

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
    // document.getElementById('responseContainer').value = 'Primary email: ' +
         primaryEmail + '\n\nFull Response:\n' + JSON.stringify(resp);
     alert(primaryEmail+" Email");
    localStorage.setItem("email",primaryEmail);
  }


$(document).ready(function() {
    // page is now ready, initialize the calendar...
    var email = localStorage.getItem("email");
    console.log(email+" get email");
    $('#calendar').fullCalendar({
        googleCalendarApiKey: 'AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE',
        events: {
            googleCalendarId: email
        }
    });

});