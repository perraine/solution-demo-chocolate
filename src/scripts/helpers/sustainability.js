// Sustainability - data object defined in customFields.js
// ***************
function showSustainability(sustainability) {

    var sustainabilityList = JSON.parse(sustainability);

    $.each(sustainabilityList, function(index, element) {

        if (element.state == 'open') {
            var itemState = 'on';
        } else {
            var itemState = '';
        }

        var itemImg = ' ';
        var description = decodeHtml(element.description);

        if(element.img) {
            var itemImg = '<img src="' + element.img + '" />';
        }

        var list = $('<li class="sustainability-item accordion-item ' + itemState + '"></li>');
        $('.information-items').append(list);
        list.append('<span class="list-name"><i class="mdi ' + element.icon + '"></i>' + element.title + '</span>');
        list.append('<span class="list-value">' + itemImg + description + '</span>');
    });

}

// Allow HTML in description - woohoo!
function decodeHtml(html) {
    return $('<span>').html(html).text();
}
