// Reorder Info List / Links
function showReorder(reorder) {
    var reorderList = JSON.parse(reorder);
    $.each(reorderList, function(index, element) {
        var list = $('<li class="reorder-list__item"></li>');
        $('.reorder-list__items').append(list);
        list.append('<a href="' + element.link + '" class="reorder-list__link">\n<span class="reorder-list__img" style="background-image:url(' + element.img + ');"></span>\n<span class="reorder-list__content"><span class="reorder-list__title">' + element.title + '</span>\n<span class="reorder-list__description">' + element.description + '</span>\n<span class="reorder-list__price">' + element.price + '</span>\n</span>\n<i class="reorder-list__icon mdi mdi-chevron-right"></i></a>');
    });

}