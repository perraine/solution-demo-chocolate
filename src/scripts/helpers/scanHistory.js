function showScanHistory(actionData, actionIcons) {

    var actions = actionData;

    $.each(actions, function(index, element) {
        var list = $('<li class="timeline-event"></li>');
        var date = new Date(element.createdAt).toLocaleDateString('en-GB', {day : 'numeric', month : 'short', year : 'numeric'}).split(' ').join(' ');
        $('.timeline-events').append(list);
        list.append('<span class="date">' + date + '</span><span class="title">' + element.type + '</span><span class="location"></span>');
    });

}