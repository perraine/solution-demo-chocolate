// Menu slider
// ***************
$('.main-menu-toggle').click(function() {
  $('body').toggleClass('menu-active');
  return false;
});

// Menu builder - taken from App JSON
// ***************
function loadAppMenu(menuJson) {

  var menuItems = JSON.parse(menuJson);

  // Order menuItems object (Alphabetically on Label)
  function sortByLabel(x,y) {
    return ((x.label == y.label) ? 0 : ((x.label > y.label) ? 1 : -1 ));
  }
  var menuItems = menuItems.sort(sortByLabel);

  // Loop through Object
  $.each(menuItems, function(index, element) {
    if (element.label) {
      $('.generatedLinks').append(
        '<a data-title="' + element.label + '" href="?thng=' +
          element.thng +
          '&state=' +
          element.state +
          '&appKey=' +
          appKey +
          '&region=' +
          region +
          '" class="link">' +
          element.label +
          '</a>'
      );
    }
  });

  $(".menu-links .home-link, .global-header .brand a").attr('href', '/?appKey=' + appKey +'&region=' + region + '');
}