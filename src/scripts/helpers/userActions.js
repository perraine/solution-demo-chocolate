// user.action('scans').read({
//   params: {
//     context: true
//   }
// }).then(function(actions) {

//     var anonUserLocationRegion = actions[0].context.region;
//     var anonUserLocationCity = actions[0].context.city;

//     if(anonUserLocationCity || anonUserLocationRegion) {

//         if(anonUserLocationCity) {
//             $('.locationCTA .contextTown').html('' + anonUserLocationCity + ',');
//         }

//         if(anonUserLocationRegion) {
//             $('.locationCTA .contextRegion').html(anonUserLocationRegion);
//         }

//     }

//     // Read timeline items
//     // ***************
//     if (thng.customFields.timeline01) {
//         showTimeLine(customFieldArrayToJson('timeline', thng.customFields), anonUserLocationRegion, anonUserLocationCity);
//     }

// });