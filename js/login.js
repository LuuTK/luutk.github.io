var calendar;
var edit =false;
var visible = false; // stores where popovers are visible
var colorVisible = false; //store where color popover are visible
var customcolorVisible =false; //store where custom color popover
var IDArrayIndex =0;
var colorArrayIndex =0;
var arrayId = [];
var arrayColors = [];
var click = false;
arrayID = JSON.parse(localStorage.getItem('idArray'));
arrayColors = JSON.parse(localStorage.getItem('colorArray'));


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
    //set cal colour
    //localStorage.setItem("colour", "grey");
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
    gapi.client.setApiKey('AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q');//  //OG : AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q

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
    var e = document.getElementById("remind")
    var reminder = e.options[e.selectedIndex].value
   auth()
    //load calendar API
    gapi.client.load('calendar', 'v3', function(){

        if(reminder == "none") {
            var remind = false
            console.log("No reminder")
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
        }else{
            var remind = true
            console.log("need reminder")
            console.log("reminder: "+ reminder)
            var min = document.getElementById("remindMin").value;
            var resource = {
                "summary": localStorage.getItem('Title'),
                "location": localStorage.getItem('location'),
                "start": {
                    "dateTime": localStorage.getItem('startDate'),
                    "timeZone": "America/Toronto"
                },
                "end": {
                    "dateTime": localStorage.getItem('endDate'),
                    "timeZone": "America/Toronto"
                },
                "reminders": {
                    "useDefault": false,
                    "overrides": [{
                        "method": reminder,
                        "minutes": min
                    }]

                }
            };
        }
        var request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            //'sendNotifications': remind,
            'resource': resource
        });
        request.execute(function(resp){
            console.log(resp);
            //console.log(resp.id);
            localStorage.setItem("gEventID", resp.id)
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
        googleCalendarApiKey : 'AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q',
        events : {
            googleCalendarId : email
            //color: localStorage.getItem("colour")
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
            closePopup();
         },
            /////////////////////////////////////////////////////
            /////////////////////////HERE////////////////////////
            /////////////////////////////////////////////////////

            //eventRender: function(calEvent, element) {
            //    var pos = 0
            //    arrayColors = JSON.parse(localStorage.getItem('colorArray'));
            //    arrayId = JSON.parse(localStorage.getItem('idArray'));
            //    console.log("Render color: "+arrayColors)
            //    console.log("Render ID: "+arrayId)
            //    for(var i = 0; i < arrayId.length; i++) {
            //        pos = i
            //        if (calEvent.id == arrayId[pos]) {
            //            consol.log("Found EVENT with same ID")
            //            element.css('background-color', arrayColors[pos]);
            //        }
            //    }
            //},



         //after the user clicks on an event he has to click the delete or modify button to delete or modify the event he has selected
         eventClick: function(calEvent, jsEvent, view) {
             // disable redirect to google
             // calEvent.url = null
             //get and set event google event ID when user click on it.
            
            var eventID = calEvent.id;
             localStorage.setItem('gEventID', eventID);
             click = true

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
            // localStorage.setItem("cur_color",color)

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
                                +"<p>Category"
                                +"<select id='colourChoice'>"
                                +"<option value='blue'>Default</option>"
                                +"<option value='red'>Red</option>"
                                +"<option value='green'> Green </option>"
                                +"</select></p>"
                    + "<button type='button' onclick='mod_display()' class='btn btn-primary'>Modify</button>  "
                    + "<button type='button' onclick='deleteEvent()' class='btn btn-primary'>Delete</button>"
                    +"<button type='button' onclick='saveColor()' class='btn btn-primary'>Save</button>"
                    +"<button type = 'button' onclick ='chooseColorOption()' class = 'btn btn-primary'>Choose Custom Color</button>"
                    + "</div>"
                })
                $(this).popover('show');

            }
             return false;
        }
    });
   // colorLoop()
}


function colorLoop(){
    
    console.log("COLOR LOOP")
    arrayColors = JSON.parse(localStorage.getItem('colorArray'));
    arrayId = JSON.parse(localStorage.getItem('idArray'));
    console.log(arrayColors)
    console.log(arrayId)
    for(var i = 0; i < arrayId.length; i++) {
        var events = $('#calendar').fullCalendar('clientEvents', function(evt) {
                                                // console.log("FOUND EVENT!!");
            return evt.id == arrayId[i];
        });
        events.color = arrayColors[i];
        $('#calendar').fullCalendar('updateEvent', events);

        //$('#calendar').fullCalendar({
        //
        //    eventRender: function(event, element) {
        //        for(var i = 0; i < arrayId.length; i++) {
        //            pos = i
        //            if (event.id == arrayId[pos]) {
        //                element.css('background-color', arrayColors[pos]);
        //            }
        //        }
        //    }
            //events:[
            //    {
            //        id: arrayId[pos]
            //    }
            //],
            //eventColor: arrayColors[pos]
       // });
    }
}
function chooseColorOption(){
    if (customcolorVisible) {
        customcolorVisible = false;
        $('#customcolorcategory').popover('hide');
    } else {
        customcolorVisible = true;
        $('#customcolorcategory').popover({
                                    html: true,
                                    placement: 'down',
                                    container: 'body',
                                    title: 'Choose color',
                                    content:'<p><select id = "colourChoiceTwo">'
                                    +'<option value="blue">Default</option>'
                                    +'<option value="red">Red</option>'
                                    +'<option value="green"> Green </option>'
                                    +'<option value="purple"> Purple </option>'
                                    +'<option value ="yellow"> Yellow </option>'
                                    +'<option value ="black"> Black </option>'
                                    +'<option value ="brown"> Brown </option>'
                                    +'<option value ="grey"> Grey </option>'
                                    +'<option value ="pink"> Pink </option>'
                                    +'<option value ="orange"> Orange </option>'
                                    +'</select></p>'
                                    +'<p><button type="button" class="btn btn-primary form-submit" onclick="saveColor()">Save</button></p>'
                                    })
        $('#customcolorcategory').popover('show');
    }
}



function showColorOption(){
    if (colorVisible) {
        colorVisible = false;
        $('#colorcategory').popover('hide');
    } else {
        colorVisible = true;
        $('#colorcategory').popover({
                            html: true,
                            placement: 'down',
                            container: 'body',
                            title: 'Choose color',
                            content:'<p><select id = "colorChoice">'
                                                    +'<option value="blue">Default</option>'
                                                    +'<option value="red">Red</option>'
                                                    +'<option value="green"> Green </option>'
                                                    +'<option value="purple"> Purple </option>'
                                                    +'<option value ="yellow"> Yellow </option>'
                                                    +'<option value ="black"> Black </option>'
                                                    +'<option value ="brown"> Brown </option>'
                                                    +'<option value ="grey"> Grey </option>'
                                                    +'<option value ="pink"> Pink </option>'
                                                    +'<option value ="orange"> Orange </option>'
                                                    +'</select></p>'
                                                    +'<p><button type="button" class="btn btn-primary form-submit" onclick="addColor()">Save</button></p>'
                            })
        $('#colorcategory').popover('show');
    }
}

function addColor(){
    
var data  = document.getElementById("colorChoice").value;
document.getElementById("color").innerHTML += '<option value="'+data+'">'+data+'</option>';
$('#colorcategory').popover('hide');
}
//    colorVisible = false;
//    document.getElementById("color").innerHTML += '<option value = Color> Category </option>';
//}

// Call this function to close popovers on calendar
function closePopup () {
    if ($('.popover').hasClass('in')) {
        $('.popover').popover('hide');
        visible = false;
    }
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
    +'<td>Reminder</td>'
    +'<td>'
    +'<select id="remind_popup">'
    +'<option value="none">No Reminder</option>'
    +'<option value="sms">SMS</option>'
    +'<option value="email">Email</option>'
    +'</select>'
    +'<br><input type="text" name="minutes" style="width:25%" id="remindMin_popup"> minutes'
    +'</td>'
    +'</tr>'
    +'</table>'
    +'</form>'
    +'<div class="form-submit">'
    +'<button type="button" class="btn btn-primary form-submit" onclick="after_mod()">Cancel</button>  '
    +'<button type="button" class="btn btn-primary form-submit" onclick="modify()">Modify</button>'
}

function saveColor() {
    auth();
    $('#customcolorcategory').popover('hide');
    
    var data = document.getElementById('colourChoice').value;
    
    localStorage.setItem("colour", data);
    
    alert("This is the color " + data);


/*
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
                    "reminders": {
                        "useDefault": false,
                        "overrides": [{
                            "method": reminder,
                            "minutes": min
                        }]
                    }
                };
            }
            
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': localStorage.getItem('gEventID'),
                'resource':

*/
    var tempKey = localStorage.getItem('gEventID')
                    var resource = {
                      "kind": "calendar#colors",
                      "event": {
                        (tempKey): {
                          "background": "red",
                          "foreground": "blue"
                        }
                      }
                    };
            
        //load calendar API
        console.log("event Id  = " + localStorage.getItem('gEventID'));
        gapi.client.load('calendar', 'v3', function(){

            
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary', //used to be 'primary'
                'eventId': localStorage.getItem('gEventID'),
                'resource' : resource

            });
                console.log("JSON request = " + JSON.stringify(request));
            request.execute(function(resp){
                console.log("response = " + JSON.stringify(resp));
                after_mod();
            })
        })
    
    
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
        var e = document.getElementById("remind_popup")
        var reminder = e.options[e.selectedIndex].value
        auth()

        //load calendar API
        gapi.client.load('calendar', 'v3', function(){

            if (reminder == "none") {
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
            } else {
                var min = document.getElementById("remindMin_popup").value;
                var resource = {
                    //Title of the event
                    "summary": localStorage.getItem('Title'),
                    //location
                    "location": localStorage.getItem('location'),
                    "colorId": "red",
                    "start": {
                        //start time: formate YY-mm-ddTHH:MM:SS / Year-month/dateTHour:Mins:second
                        "dateTime": localStorage.getItem('startDate'),
                        "timeZone": "America/Toronto"
                    },
                         
                    "end": {
                        "dateTime": localStorage.getItem('endDate'),
                        "timeZone": "America/Toronto"
                    },
                    "reminders": {
                        "useDefault": false,
                        "overrides": [{
                            "method": reminder,
                            "minutes": min
                        }]
                    }
                };
            }
            
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': localStorage.getItem('gEventID'),
                'resource': resource
            });
            request.execute(function(resp){
                console.log(resp);
                console.log(resp.id);
                after_mod();
            })
        })
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
    +"<p>Category"
    +"<select id='color'>"
    +"<option value='blue'>Default</option>"
    +"<option value='red'>Red</option>"
    +"<option value='green'> Green </option>"
    +"</select></p>"
    + "<button type='button' onclick='mod_display()' class='btn btn-primary'>Modify</button>  "
    + "<button type='button' onclick='deleteEvent()' class='btn btn-primary'>Delete</button>"
    +"<button type='button' onclick='saveColor()' class='btn btn-primary'>Save</button>"
    +"<button type = 'button' onclick ='showColorOption()' class = 'btn btn-primary'>Choose Custom Color</button>"
    + "</div>"

    $('#calendar').fullCalendar( 'refetchEvents' );

    // close the popup
    closePopup();
}


function deleteEvent() {
    auth()
    //load calendar API
    gapi.client.load('calendar', 'v3', function(){
       
        var request = gapi.client.calendar.events.delete({
            'calendarId': 'primary',
            'eventId': localStorage.getItem('gEventID')
         
        });
      //  $('#calendar').fullCalendar('removeEvents', calEvent._id);
        request.execute(function(resp){
            console.log(resp);
        })
    })
     $('#calendar').fullCalendar("removeEvents",  localStorage.getItem('gEventID'));
     //$('#calendar').fullCalendar("refetchEvents");   
     toggleTable()
     closePopup();
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
    data[6] = document.getElementById("color").value;
//    else if (data[6] =="newCategory"){
//        //get the color and name for the color - popup ? or alert ?
//        showColorOption();
//    }

    
    localStorage.setItem('Title', data[0]);
    localStorage.setItem('location', data[1]);
   // localStorage.setItem('color', data[6]);



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
                              end: endDate,
                              color: data[6]
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
    data[6] = document.getElementById("color").value;
    
    localStorage.setItem('Title', data[0]);
    localStorage.setItem('location', data[1]);


    if(validateForm(data)){

        var startDate = data[2]+"T"+data[3]+":00";
        var endDate = data[4]+"T"+data[5]+":00";
        localStorage.setItem('startDate', startDate);
        localStorage.setItem('endDate', endDate);
        localStorage.setItem('colour', data[6]);
        insert();
        calendar.fullCalendar('renderEvent',
                              {
                              title: data[0],
                              location: data[1],
                              start:startDate,
                              end: endDate,
                              color: data[6]
                              },
                              true)

        arrayId = JSON.parse(localStorage.getItem('idArray'));
        arrayId[IDArrayIndex] = localStorage.getItem("gEventID")
        console.log("arrayID: "+ arrayId)
        IDArrayIndex++
        localStorage.setItem('idArray',JSON.stringify(arrayId));
        console.log("IN send form  eventID: "+ JSON.parse(localStorage.getItem('idArray')))

    }else {
        alert("There was an error in your form, please make sure you filled everything properly");
    }
    edit =false;
    //clearForm();
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

        try{
        var wind = response.query.results.channel.wind;
        var channel = response.query.results.channel;
        var units = response.query.results.channel.units;
        document.getElementById('weather_temperature').innerHTML = "Temperature : " + farenheitToCelcius(wind.chill) + " Celcius";
        document.getElementById('weather_title').innerHTML = "Location Title : " + channel.title;
        document.getElementById('weather_description').innerHTML = "Location Description : " + channel.description;
        document.getElementById('weather_wind_speed').innerHTML = "Wind Speed : " + parseFloat(wind.speed*0.6213711920).toFixed(2) + " km/h";
        }catch(error){
            alert('City Not Found :(');
        }

      }
    });
}

function farenheitToCelcius(value){

    return ((value - 30) / 2);


}

function getTimeFromLocation(){
    //https://maps.googleapis.com/maps/api/geocode/json?address=Winnetka&key=API_KEY
    var apiKey = "AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q"; // tuan's api key
    //var apiKey = "AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q";
    var cityName = document.getElementById("weather_location").value;
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityName + "&key=" + apiKey;
    var latitude = "";
    var longitude = "";
    var timeFromGeo = "";

    $.ajax({
      dataType: "json",
      url: url,
      success: function(response) {

        try{


        latitude = response.results[0].geometry.location.lat;
        longitude = response.results[0].geometry.location.lng;
        timeFromGeo =  getTimeFromGeoLocation(latitude, longitude);
        //console.log(response.results[0].geometry.location.lat);
        //console.log(response);
        //console.log(latitude);
        //console.log("latitude = " + latitude);
        //console.log("longitude = " + longitude);


        //document.getElementById('weather_temperature').innerHTML = "time = " + timeFromGeo;
        }catch(error){
            alert('City Not Found :( (time)');
            alert(error);
        }

      }
    });

}

function getTimeFromGeoLocation(latitude, longitude){

    // Updating the time every seconds
   // setInterval(function() { 
    // Updating the time every second
    //setInterval(function() {
        console.log("latitude in geo = " + latitude);
     //http://api.geonames.org/timezone?lat=45.5016889&lng=-73.567256&username=demo
        var timeFromGeo = "";
       // var url = "http://api.geonames.org/timezone?lat=45.5016889&lng=-73.567256&username=tikaylou";
        var url = "http://api.geonames.org/timezoneJSON?lat=" + latitude + "&lng=" + longitude + "&username=tikaylou";
        $.ajax({
          dataType: "json",
          url: url,
          success: function(response) {

            try{
            var timeFound = response.time;
            //console.log("GEONAMES  response = " + timeFound);
            document.getElementById('date_time').innerHTML = "Date and time = " + timeFound;
            document.getElementById('timezoneId').innerHTML = "time zone id = " + response.timezoneId;
            //alert("Time is " + timeFound);
            }catch(error){
                alert('Time Not Found :(');
            }

          }
        });
        
   // }, 1000);

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

// Called when user clicks Share Calendar button
function shareCalendar() {
    var shareEmails = document.getElementById("shareUserEmail").value;
    // separate each email into an array
    var emailArray = shareEmails.split(";"); 

    // Validate each email
    for (i = 0; i < emailArray.length; i++) {
        if (!validateEmail(emailArray[i])) {
            alert("Please enter an valid email address");
            return;
        }
    }

    auth();

    // Share invite to each invitee
    for (i = 0; i < emailArray.length; i++) {
        shareToInviteeTest(emailArray[i]);
    }
}

// Share calendar to invitee
function shareToInvitee(email) {
    gapi.client.load('calendar', 'v3', function(){

        var request = gapi.client.calendar.acl.insert({
            'calendarId': 'primary',
            "role": "writer",
            "scope": {
                "value": email,
                "type": "user"
            }
        });

        request.execute(function(resp){
            console.log(resp);
        })
    });
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
     apiurlrequest="https://www.googleapis.com/calendar/v3/calendars/nkyfxlyy%40gmail.com/events/eg1hnbgm0u1lpn8203os0lu100?key={'AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q'}";
  

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

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}   


function shareTest(){
//https://www.googleapis.com/calendar/v3/calendars/tuankietluu%40gmail.com/events/quickAdd?text=test+share&sendNotifications=true&key={YOUR_API_KEY}
        var apiKey = "AIzaSyB5DEE-jivGjx1LjoTMUL1rQbJ5OJF-_6Q";
        var url = "https://www.googleapis.com/calendar/v3/calendars/tuankietluu%40gmail.com/events/quickAdd?text=test+share&sendNotifications=true&key=" + apiKey;
   
        $.ajax({
          dataType: "json",
          url: url,
          success: function(response) {

            try{
                console.log(response);
                console.log(JSON.stringify(response));
            }catch(error){
                alert('Share Error');
            }

          }
        });


}


function shareToInviteeTest(email) {

  auth();
            //load calendar API
            gapi.client.load('calendar', 'v3', function(){
                var resource = 

                 {
                 "role": "reader",
                 "scope": {
                  "type": "user",
                  "value": email
                 }
                }
                var request = gapi.client.calendar.acl.insert({
                    'calendarId': 'primary',

                    'resource': resource
                });
                request.execute(function(resp){
                    console.log(resp);
                })
            })
}