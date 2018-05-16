// Timeline - first item defaults to today and scan by 'You' - function called in thng.js
// ***************
function showTimeLine(timelineData, city, region) {

    var timeline = JSON.parse(timelineData);

    // add Todays Latest Scan then display
    var timelineEntry = {};

    // Format date nicely - to today!
    timelineEntry.date = todaysDate();
    timelineEntry.icon = 'mdi-qrcode-scan';
    timelineEntry.title = 'Scanned by You';

    // Get location from local storage - set on scan added when THNG scanned
    timelineEntry.location = '' + city + ', '+ region + '';

    // Add to top of array
    timeline.unshift(timelineEntry);

    $.each(timeline, function(index, element) {

        // Fallback to standard scan icon if none set:
        if(!element.icon) {
            element.icon = 'mdi-qrcode-scan';
        }

        var list = $('<li class="timeline-event"></li>');
        $('.timeline-events').append(list);
        list.append('<span class="icon"><i class="mdi ' + element.icon + '"></i></span><span class="date">' + element.date + '</span><span class="title">' + element.title + '</span><span class="location">' + element.location + '</span>');
    });

}

// Function to add new event to top of timeline
// ***************
function addTimelineEvent(icon, date, title, location, extra){
  $( ".timeline-events" ).prepend('<li class="timeline-event"><span class="icon"><i class="mdi '+ icon +'"></i></span><span class="date">' + date + '</span><span class="title">' + title + '</span><span class="location">' + location + '</span>' + extra + '</li>');
};
