// Get Tag from THNG: Used in Purchase and Recommended
// ***************
function filterByTag(tag) {
    return {
        params: {
            filter: {
                tags: tag
            }
        }
    }
}

// Decode the URL string passed into the App after a native QR Code Scan
// ***************
function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Global app reset to home and clear modals/overlays
// ***************
function resetAppScreen() {
    $('.alert').removeClass('on');
    $('.modal').removeClass('on');
    $('body').removeClass();
    $('body').addClass('start');
}

// Global class to reset app UI to homescreen
// ***************
$('.reset-app-screen').click(function(){
    resetAppScreen();
    return false;
});

// Clean user entered text of odd characters that could break the template population
// ***************
function escapeHtml(text) {

  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });

}

// Populate template with standard THNG fields
// ***************
function populateThngTemplate(state, thng) {

    if(!thng.name){
        thng.name = '';
    }
    if(!thng.description){
        thng.description = '';
    }
    if(!thng.customFields.button){
        thng.customFields.button = 'No Button Text Provided';
        $('#' + state + ' .button').addClass('hide');
    }
    if(thng.customFields.buttonLink){
        $('#' + state + ' .button').attr('href', thng.customFields.buttonLink).attr('target', '_blank');
    }

    $('#' + state + ' h1').html(escapeHtml(thng.name));
    $('#' + state + ' p.primary').html(thng.description);
    $('#' + state + ' .button').html(escapeHtml(thng.customFields.button));

}

// Today's date, in a nice/universal format (DD MMM YYYY)
// ***************
function todaysDate(){
    return new Date().toLocaleDateString('en-GB', {
        day : 'numeric',
        month : 'short',
        year : 'numeric'
    }).split(' ').join(' ');
}

// Allow localStorage to be cleared for app
// ***************
$(".clear-app-storage").click(function(){
    localStorage.clear();
    sessionStorage.clear();
    alertBox('localStorage Data Deleted', 'Don\'t worry, just reload the page to regenerate it again.', 'Close');
});

// Styles - set via App customFields
// ***************
function styleApp(background, color, logo) {

    if(!background) {
        background = '#EA000A';
    }

    if(!color) {
        color = 'white';
    }

    if(!logo) {
        logo = 'https://i.imgur.com/BzHgU4e.png';
    }

    $('head').append('<style>.global-header { background-color: ' + background + '; } .global-controls, .modal h1 { color: ' + color + ';} .modal h1 {background-color: ' + background + '; }</style>');
    $('.global-header .brand-img').css('background-image', 'url(' + logo + ')');
}

// Modal Titles - set via App customFields
// ***************
function modalTitles(information, video, reviews, timeline, redeem, reorder) {

    if(information) {
        modalTitleCss('#product-information', information);
    }
    if(video) {
        modalTitleCss('#video', video);
    }
    if(reviews) {
        modalTitleCss('#reviews', reviews);
    }
    if(timeline) {
        modalTitleCss('#timeline', timeline);
    }
    if(redeem) {
        modalTitleCss('#redeem-offer', redeem);
    }
    if(reorder) {
        modalTitleCss('#reorder-list', reorder);
    }

}

function modalTitleCss(id, value) {

    $('head').append('<style>' + id + '.modal h1:before {content: "' + value + '";}</style>');
}

// Accordion toggle
// ***************
$(document).ready(function() {
    $('ul').on('click', '.accordion-item .list-name', function() {
        $(this).parent('.accordion-item').toggleClass('on');
        $(this).parent('.accordion-item').siblings().removeClass('on');
        return false;
    });
});
