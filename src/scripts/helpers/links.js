// Additional Links - optional addition to screen(s), data object defined in customFields.js
function showAdditionalLinks(links) {

    var additionalLinks = JSON.parse(links);

    $.each(additionalLinks, function(index, element) {

        var list = $('<li class="additional-link"></li>');

        if(element.icon) {
            var icon = element.icon;
        } else {
        	var icon = 'mdi-record';
        }

        list.append('<div class="additional-link-icon"><i class="mdi ' + icon + '"></i></div><div class="additional-link-title">' + element.title + '</div><i class="mdi mdi-chevron-right additional-link-icon-more"></i>');
        $('.additional-links').append(list);

    });

}