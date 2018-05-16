// Generate Simulated Scans for Demo
// ***************

$('.startScanSimulation').click(function(){

  var totalScans = $('#simulated-scan-total').val();
  var regionScans = $('#simulated-scan-location').val();

  if(totalScans == '' || regionScans == '') {

    alert('Please enter a value for scans and/or region');

  } else {

    simulateScans(regionScans, totalScans);

  }

  return false;

});


function simulateScans(region, total) {

  var appKey = getParameterByName('appKey');

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://evt-seeder.herokuapp.com/simulator",
    "method": "POST",
    "headers": {
      "content-type": "application/json",
      "accept": "application/json",
      "authorization": "" + appKey + "",
      "cache-control": "no-cache"
    },
    "processData": false,
    "data": "{ \"region\" : \"" + region + "\", \"numberOfScans\" : " + total + " }"
  }

  $.ajax(settings).done(function (response) {

    // Clear the form inputs
    $('#simulated-scan-total, #simulated-scan-location').val("");

    // Give a friendly alert to show task has completed
    alertBox("Simulation Request Sent", "Random scans will appear in your chosen region.", "Return to Scan Screen");
    console.log(response);

  });

}