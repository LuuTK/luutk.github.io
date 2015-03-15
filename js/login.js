var calendar;
var edit =false;
var visible = false; // stores where popovers are visible
//toggleTable(true);
//toggleTable(true);
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

/**
Return access token
 */
function getAccessToken() {
	return "token";
}

/**
 * Sets up an API call after the Google API client loads.
 */
function apiClientLoaded() {
	gapi.client.plus.people.get({
		userId : 'me'
	}).execute(handleEmailResponse);
}

/**
 * auth to use api
 * This method should be called everytime you load an api as this will grant the use for it
 */
function auth(){
    //Set api key
    gapi.client.setApiKey('AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE');

    //Set access token
    var token = localStorage.getItem("accessToken");
    gapi.auth.setToken({
        access_token: token
    })
}

/**
 * Insert event handler
 */
function insert(){
   auth()
    //load calendar API
    gapi.client.load('calendar', 'v3', function(){
        var resource = {
            //Title of the event
            "summary": localStorage.getItem('Title'),
            //location
            "location": localStorage.getItem('location'),
            "start": {
                //start time: formate YY-mm-ddTHH:MM:SS / Year-month/dateTHour:Mins:second
                "dateTime": localStorage.getItem('startDate'),
                "timeZone": "America/Toronto"
            },
            "end": {
                "dateTime": localStorage.getItem('endDate'),
                "timeZone": "America/Toronto"
            },
            "reminders":{
                "userDefault": false
            }
        };
        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': resource
        });
        request.execute(function(resp){
            console.log(resp);
        })
    })

}

/**
 * Response callback for when the API client receives a response.
 *
 * @param resp The API response object with the user email and profile information.
 */
function handleEmailResponse(resp) {

	var primaryEmail;
	console.log("resp = " + JSON.stringify(resp));

}

// Displays full calendar when main.html is loaded

function loadFullCalendar() {

	console.log("load calendar");
	console.log("localStorage = " + JSON.stringify(localStorage));

	// page is now ready, initialize the calendar...
	var email = localStorage.getItem("email");

	document.getElementById('user_email').innerHTML = "Welcome " + email;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

	calendar=$('#calendar').fullCalendar({

        // Connect to Google Calendar
		googleCalendarApiKey : 'AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE',
		events : {
			googleCalendarId : email
		},
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },

        defaultView: 'month',


     //allows to be resized in week/day view, as well as moved around
     editable :true,
     selectable: true,
     selectHelper: true,

     // Called when a calendar event is clicked
     select: function(start, end, allDay) {
        // alert("Please enter new event in side form an press done");

        // Dismiss popover when clicking calendar
        if ($('.popover').hasClass('in')) {
            $('.popover').popover('hide');
            visible = false;
        }
     },

     //after the user clicks on an event he has to click the delete or modify button to delete or modify the event he has selected
     eventClick: function(calEvent, jsEvent, view) {
         // disable redirect to google
         // calEvent.url = null
         //get and set event google event ID when user click on it.
         var eventID = calEvent.id;
         localStorage.setItem('gEventID', eventID);

         var title = calEvent.title;
         var location = calEvent.location;
         var startTime = moment(calEvent.start).format("DD-MM-YYYY HH:mm");
         var endTime = moment(calEvent.end).format("DD-MM-YYYY HH:mm");

         if (typeof location == 'undefined') {
            location = "";
         }
         localStorage.setItem("cur_title", title)
         localStorage.setItem("cur_location", location)
         localStorage.setItem("cur_sTime", startTime)
         localStorage.setItem("cur_eTime", endTime)

         // Dismiss/show popovers
        if (visible) {
            visible = false;
            $('.popover').popover('hide');
        } else {
            visible = true;
            $(this).popover({
                html: true,
                placement: 'right',
                container: 'body',
                title: title,
                content: "<div id='eventinfo'><p><b>Location:</b>  " + location
                + "</p><p><b>Start Time:</b> " + startTime 
                + "</p><p><b>End Time:</b> " + endTime
                + "</p>"
                + "<button type='button' onclick='mod_display()' class='btn btn-primary'>Modify</button>  "
                + "<button type='button' onclick='deleteEvent()' class='btn btn-primary'>Delete</button>"
                + "</div>"
            })
            $(this).popover('show');
        }

         return false;
     }

    });
}

function closePopup () {
     document.getElementById("eventInfo").innerHTML="<button type ='button'class = 'close' >Close</button>";
     
    e= $('#close');
    $('.pop').slideFadeToggle(function() {
                              e.removeClass('selected');
                              });
    return false;
}

$.fn.slideFadeToggle = function(easing, callback) {
    return this.animate({ opacity: 'toggle', height: 'toggle' }, 'fast', easing, callback);
};
    function mod_display(calEvent){
        document.getElementById("eventinfo").innerHTML =  '<form id="newevent">'
        +'<table>'
        +'<tr>'
        +'<td>Event</td>'
        +'<td><input type="text" name="event" style="width:75%" id="mEventname" value="'
        + localStorage.getItem("cur_title")+'">'
        +'</td>'
        +' </tr>'
        +'<tr>'
        +'<td>Location</td>'
        +'<td><input type="text" name="location" style="width:75%" id="mLocation" value="'
        + localStorage.getItem("cur_location")+'">'
        +'</td>'
        +'</tr>'
        +'<tr>'
        +'<td>From</td>'
        +'<td>'
        +'<input type="date" name="fdate" id="mfdate">'
        +'<input type="time" name="ftime" id="mftime">'
        +'</td>'
        +'</tr>'
        +'<tr>'
        +'<td>To</td>'
        +'<td>'
        +'<input type="date" name="tdate" id="mtdate">'
        +'<input type="time" name="ttime" id="mttime">'
        +'</td>'
        +'</tr>'
        +'<tr>'
        +'<td>Category</td>'
        +'<td><select>'
        +'<option value="default">Default</option>'
        +'<option value="red">Red</option>'
        +'</select></td>'
        +'</tr>'

        +'</table>'
        +'</form>'

        +'<div class="form-submit">'
        +'<button type="button" class="btn btn-primary form-submit" onclick="after_mod()">Cancel</button>'
        +'<button type="button" class="btn btn-primary form-submit" onclick="modify()">Modify</button>'
    }
    function modify(){

        var data = new Array();
        data[0] = document.getElementById("mEventname").value;
        data[1] = document.getElementById("mLocation").value;
        data[2] = document.getElementById("mfdate").value;
        data[3] = document.getElementById("mftime").value;
        data[4] = document.getElementById("mtdate").value;
        data[5] = document.getElementById("mttime").value;

        localStorage.setItem('Title', data[0]);
        localStorage.setItem('location', data[1]);
        localStorage.setItem("cur_title", data[0])
        localStorage.setItem("cur_location", data[1])

        if(validateForm(data)){
            var startDate = data[2]+"T"+data[3]+":00";
            var endDate = data[4]+"T"+data[5]+":00";
            localStorage.setItem('startDate', startDate);
            localStorage.setItem('endDate', endDate);
            localStorage.setItem("cur_sTime", startDate)
            localStorage.setItem("cur_eTime", endDate)
            auth()
            //load calendar API
            gapi.client.load('calendar', 'v3', function(){
                var resource = {
                    //Title of the event
                    "summary": localStorage.getItem('Title'),
                    //location
                    "location": localStorage.getItem('location'),
                    "start": {
                        //start time: formate YY-mm-ddTHH:MM:SS / Year-month/dateTHour:Mins:second
                        "dateTime": localStorage.getItem('startDate'),
                        "timeZone": "America/Toronto"
                    },
                    "end": {
                        "dateTime": localStorage.getItem('endDate'),
                        "timeZone": "America/Toronto"
                    }
                };
                var request = gapi.client.calendar.events.update({
                    'calendarId': 'primary',
                    'eventId': localStorage.getItem('gEventID'),
                    'resource': resource
                });
                after_mod();
                request.execute(function(resp){
                    console.log(resp);
                })
            })
            after_mod();
        }else {
            alert("There was an error in your form, please make sure you filled everything properly");
            clearForm();
        }
    }

function after_mod(calEvent){
    $(this).popover({
      title: localStorage.getItem("cur_title")
    })
    document.getElementById("eventinfo").innerHTML = "<p><b>Location:</b>  " + localStorage.getItem("cur_location")
    + "</p><p><b>Start Time:</b> " + localStorage.getItem("cur_sTime")
    + "</p><p><b>End Time:</b> " + localStorage.getItem("cur_eTime")
    + "</p>"
    + "<button type='button' onclick='mod_display()' class='btn btn-primary'>Modify</button>  "
    + "<button type='button' onclick='deleteEvent()' class='btn btn-primary'>Delete</button>"
    + "</div>"

    $('#calendar').fullCalendar( 'refetchEvents' );
}

function deleteEvent() {
    auth()
    //load calendar API
    gapi.client.load('calendar', 'v3', function(){
       
        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': localStorage.getItem('gEventID'),
         
        });
      //  $('#calendar').fullCalendar('removeEvents', calEvent._id);
        request.execute(function(resp){
            console.log(resp);
        })
    })
     $('#calendar').fullCalendar("removeEvents",  localStorage.getItem('gEventID'));
     //$('#calendar').fullCalendar("refetchEvents");   
     toggleTable()
}

function toggleTable() {
   // toggleList(true)
    var lTable = document.getElementById("newevent").style.display;
    if (lTable == "table" ) {
        lTable = "none";

    } else {
        lTable = "table";
    }
}

function editEvent(calEvent){

    while (!edit){
    }


    var data = new Array();
    data[0] = document.getElementById("eventname").value;
    data[1] = document.getElementById("location").value;
    data[2] = document.getElementById("fdate").value;
    data[3] = document.getElementById("ftime").value;
    data[4] = document.getElementById("tdate").value;
    data[5] = document.getElementById("ttime").value;


    localStorage.setItem('Title', data[0]);
    localStorage.setItem('location', data[1]);



    if(validateForm(data)){

        calendar.fullCalendar('removeEvents', calEvent._id);


        var startDate = data[2]+"T"+data[3]+":00";
        var endDate = data[4]+"T"+data[5]+":00";
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);

        calendar.fullCalendar('renderEvent',
                              {
                              title: data[0]+"\n at: "+ data[1],
                              start:startDate,
                              end: endDate
                              },
                              true)
    }
    else {
        alert("please try again");
    }
}



function sendData(calEvent,edit)
{
    edit =true;
    var data = new Array();
    data[0] = document.getElementById("eventname").value;
    data[1] = document.getElementById("location").value;
    data[2] = document.getElementById("fdate").value;
    data[3] = document.getElementById("ftime").value;
    data[4] = document.getElementById("tdate").value;
    data[5] = document.getElementById("ttime").value;

    localStorage.setItem('Title', data[0]);
    localStorage.setItem('location', data[1]);


    if(validateForm(data)){

        var startDate = data[2]+"T"+data[3]+":00";
        var endDate = data[4]+"T"+data[5]+":00";
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
        insert();
        calendar.fullCalendar('renderEvent',
                              {
                              title: data[0],
                              location: data[1],
                              start:startDate,
                              end: endDate
                              },
                              true)
    }else {
        alert("There was an error in your form, please make sure you filled everything properly");
    }
    edit =false;
    clearForm();
}

/* Clear the new event form */
function clearForm() {
    console.log("clear form");
    document.getElementById("newevent").reset();
}

function validateForm(data){
    var result = true;

    if (data[0].length ==0  || data[1].length ==0){
        result = false;
    }
    else if (!correctDate(data[2], data[4], data[3], data[5])){
        result = false;
    }
    else {
        result =true;
    }

    return result;
}

//CREDIT :  paulschreiber, regular expresssion taken from https://paulschreiber.com/blog/2007/03/02/javascript-date-validation/

function correctDate(begDate, endDate, begTime, endTime){
    var result =true;

    var regularExp = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");

    //first I check if both strings are of the correct format

    var firstDate = regularExp.test(begDate);
    var secondDate =regularExp.test(endDate);

    if (!firstDate || !secondDate){
        result= false;
    }

    // then I check if beginning date >= current date
    var year = parseInt(begDate.substr(0,4));
    var month = parseInt(begDate.substr(5,2));
    var day = parseInt(begDate.substr(8,2));

    if (year < new Date().getFullYear()){
        result= false;
    }
    else if (year == new Date().getFullYear() && month-1 <new Date().getMonth()) { //-1 because months starts with 0
        result= false;
    }
    else if (year == new Date().getFullYear() && month-1 == new Date().getMonth() && day < new Date().getDate()) {
        result= false;
    }
    else {
        result = true;
    }

    //then I check if end date >= beginning date
    var endYear = parseInt(endDate.substr(0,4));
    var endMonth = parseInt(endDate.substr(5,2));
    var endDay = parseInt(endDate.substr(8,2));



    if (endYear < year){
        result = false;
    }
    else if(endYear == year && endMonth <month){
        result = false;
    }
    else if (endYear ==year && endMonth ==month  && endDay <day){
        result = false;
    }

    //
    //        //then I check for time
    //
    //check for valid time format

    var regularExpTime = new RegExp("^([0-9]{2}):([0-9]{2})$");

    var firstTime = regularExpTime.test(begTime);
    var secondTime =regularExpTime.test(endTime);

    if (!firstTime || !secondTime){
        result = false;
    }


    var hour = parseInt(begTime.substr(0,2));
    var minutes= parseInt(begTime.substr(3,2));

    //then I check if time >= current time
    if (year == new Date().getFullYear() && month-1 == new Date().getMonth() && day == new Date().getDate() && hour< new Date().getHours()){
        result = false;
    }
    else if (year == new Date().getFullYear() && month-1 == new Date().getMonth() && day == new Date().getDate() && hour == new Date().getHours() && minutes < new Date().getMinutes()){
        result = false;
    }

    //then I check if end time >= beginning time
    var endHour = parseInt(endTime.substr(0,2));
    var endMinutes= parseInt(endTime.substr(3,2));

    if (endYear ==year && endMonth ==month  && endDay ==day && endHour < hour){
        result = false;
    }
    else if(endYear ==year && endMonth ==month  && endDay ==day && endHour == hour && endMinutes < minutes){
        result = false;
    }

    return result;
}

// Logs out user by invalidating the access token
function logout() {
	var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + localStorage.getItem("accessToken");
	// Perform an asynchronous GET request.
	//alert("logging out");
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

//  function getWeather() {
//     var input_location = document.getElementById("weather_location").value;
//     var url1 = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22"
//     var url2 = input_location;
//     var url3 = "%2C%20ak%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
//     var url = url1+url2+url3;
//     console.log(input_location);

//     $.ajax({
//       dataType: "json",
//       url: url,
//       success: function(response) {

//         try{
//         var wind = response.query.results.channel.wind;
//         var channel = response.query.results.channel;
//         var units = response.query.results.channel.units;
//         document.getElementById('weather_temperature').innerHTML = "Temperature : " + farenheitToCelcius(wind.chill) + " Celcius";
//         document.getElementById('weather_title').innerHTML = "Location Title : " + channel.title;
//         document.getElementById('weather_description').innerHTML = "Location Description : " + channel.description;
//         document.getElementById('weather_wind_speed').innerHTML = "Wind Speed : " + parseFloat(wind.speed*0.6213711920).toFixed(2) + " km/h";
//         }catch(error){
//             alert('City Not Found :(');
//         }

//       }
//     });
// }
//testing
function getWeather(){
    //https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&key=API_KEY
    var apiKey = "AIzaSyAAxypsNYuwjy_Mc2uqEngbMxAPVO9A12M";
    var cityName = "montreal";
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + "&key=" + apiKey;

    $.ajax({
      dataType: "json",
      url: url,
      success: function(response) {

        try{
        var latitude = response.results[0].geometry.location.lat;
        var longitude = esponse.results[0].geometry.location.lng;
        var timeFromGeo =  getTimeFromGeoLocation(latitude, longitude);

        console.log(response);
        console.log("latitude = " + latitude);
        console.log("longitude = " + longitude);





        document.getElementById('weather_temperature').innerHTML = "time = " + timeFromGeo;
        }catch(error){
            alert('City Not Found :(');
        }

      }
    });

}

function getTimeFromGeoLocation(latitude, longitude){

 //http://api.geonames.org/timezone?lat=45.5016889&lng=-73.567256&username=demo
var timeFromGeo = "";
   // var url = "http://api.geonames.org/timezone?lat=45.5016889&lng=-73.567256&username=demo";
    var url = "http://api.geonames.org/timezoneJSON?lat=" + latitude + "&lng=" + longitude + "&username=demo";
    $.ajax({
      dataType: "json",
      url: url,
      success: function(response) {

        try{

        document.getElementById('weather_temperature').innerHTML = "City : " + " Hello!";
        console.log("GEONAMES  response = " + response.time);
        timeFromGeo = response.time;
        }catch(error){
            alert('City Not Found :(');
        }

      }
    });
    return timeFromGeo;
}

function farenheitToCelcius(value){

    return ((value - 30) / 2);


}



function getGeocode(){
    var input_location = document.getElementById("weather_location").value;
    var url1 = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    var url2 = input_location;
    var url3 = "&key=AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE";
    var url = url1+url2+url3;
    console.log(input_location);
    console.log(url);


$.ajax({
      dataType: "json",
      url: url,
      success: function(response) {

        try{
            console.log(JSON.stringify(response));
        }catch(error){
            alert('City Not Found :(');
        }

      }
    });

}

function enterEmail(){
    alert("the event id is "+localStorage.getItem('gEventID')+" title ="+localStorage.getItem('cur_title')+" location ="+localStorage.getItem('cur_location')+" start time ="+localStorage.getItem('cur_sTime')+" end time ="+localStorage.getItem('cur_eTime'));

    var inviteeEmail = prompt("please enter the email of an invitee.");

    if(inviteeEmail == ""){
        alert("please enter a correct email address");
    }

    
    else {
      //sent http request
      request3(inviteeEmail);
        
        return inviteeEmail;
    }
}

function getEventID(){

    return localStorage.getItem('gEventID');
}


function reformatTime(time){
    
    var splitTime=time.split("-");
    var rDay=splitTime[0];
    var rMonth=splitTime[1];
    var splitYear=splitTime[2].split(" ");
    var rYear=splitYear[0];
    var rTime=splitYear[1];
    var reformat_time= rYear+"-"+rMonth+"-"+rDay+"T"+rTime+":00";
    return reformat_time;
}


function displayEventId(){

    alert(""+localStorage.getItem("gEventID"));
}

function request(){
    auth();
    //load calendar API 
    gapi.client.load('calendar', 'v3', function(){
        

        var resource = {

                    "attendees": [{
                         "email": "happyfeet5354@gmail.com"
                    }],

                    "start": {
                        //start time: formate YY-mm-ddTHH:MM:SS / Year-month/dateTHour:Mins:second
                        "dateTime":"2015-02-27T11:11:00-05:00",
                        "timeZone": "America/Toronto"
                    },
                    "end": {
                        "dateTime": "2015-02-27T14:14:00-05:00",
                        "timeZone": "America/Toronto"
                    }
                    
                };

        // request the event update and its needed parameters
        // response will then be stored in request
        var request = gapi.client.calendar.events.update({
            'calendarId': 'nkyfxlyy@gmail.com',
            'eventId': localStorage.getItem("gEventID"),
            'resource': resource
        });

        // This will make the console to print out any error or sucess message if needed
        request.execute(function(resp){
            console.log(resp);
        })
    })
}

function request2(){
   auth();
    var sampleRequest= {

                    "start": {
                        //start time: formate YY-mm-ddTHH:MM:SS / Year-month/dateTHour:Mins:second
                        "dateTime":'2015-02-27T11:11:00-05:00',
                        "timeZone": "America/Toronto"
                    },
                    "end": {
                        "dateTime": '2015-02-27T14:14:00-05:00',
                        "timeZone": "America/Toronto"
                    },
                    "attendees": {
                         "email": 'happyfeet5354@gmail.com'
                    }
                };
     

        alert("sending request body : "+ sampleRequest);
   // alert("mark1");
     apiurlrequest="https://www.googleapis.com/calendar/v3/calendars/nkyfxlyy%40gmail.com/events/eg1hnbgm0u1lpn8203os0lu100?key={'AIzaSyCiq6fTkZwSKgvhzY-HNDZM5YQD0ebyZBE'}";
  

        $.ajax({
        url: apiurlrequest,
        type: 'PUT',
        contentType: 'text/xml',
        processData: true,
        data: sampleRequest,
        success: function(data) {
        console.log(data);
      }
    });
   // alert("here is at the end of the test request 1");
}

 function request3(inviteeEmail){

            auth();
            //load calendar API
            gapi.client.load('calendar', 'v3', function(){
                var resource = 

                        {
                         "attendees": [
                          {
                           "email": inviteeEmail
                          }
                         ],
                         "start": {
                          "dateTime": reformatTime(localStorage.getItem('cur_sTime')),
                          "timeZone": "America/Toronto"
                         },
                         "end": {
                          "timeZone": "America/Toronto",
                          "dateTime": reformatTime(localStorage.getItem('cur_eTime'))
                         },
                         "summary": localStorage.getItem('cur_title'),
                         "location": localStorage.getItem('cur_location')
                        }   
                var request = gapi.client.calendar.events.update({
                    'calendarId': 'primary',
                    'eventId': localStorage.getItem('gEventID'),
                    'resource': resource
                });
                request.execute(function(resp){
                    console.log(resp);
                })
            })

    }

function getTime(){


}

