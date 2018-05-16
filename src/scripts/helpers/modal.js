// Modal toggle
// ***************
$(document).ready(function() {
    $('body').on('click', '.overlay-toggle', function() {

        var modalID = $(this).attr('href');

        $(modalID).toggleClass('on');
        
        if(modalID == '#video') {
            if(!$(modalID).hasClass('on')) {
                var videoSrc = $('#video .video iframe').attr('src');
                $('#video .video iframe').attr('src', ''+ videoSrc +'');
            }
        }
        
        return false;
    });
});