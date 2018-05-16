// Reviews
// ***************
function showReviews(reviews) {

    var reviewsList = JSON.parse(reviews);

    $.each(reviewsList, function(index, element) {

        var list = $('<li class="reviewer-item"></li>');
        
        // A little bit of maths to get random recommended values
        var numberLow = 1 + Math.floor(Math.random() * 100);
        var numberHigh = 100 + (250 - 100) * Math.random();
        var numberHigh = Math.round(numberHigh);

        $('.review-items').append(list);
        list.append('<span class="reviewer-stars">' + formatRating(element.rating) + '</span>');
        list.append('<div class="reviewer-title">' + element.title + '</div>');
        list.append('<div class="reviewer-by-line">Review by <span class="reviewer-name">' + element.name + '</span> on <span class="reviewer-date">' + element.date + '</span></div>');
        list.append('<div class="reviewer-txt">' + element.text + '</div>');
        list.append('<div class="reviewer-vote"><span class="reviewer">' + numberLow + '</span> out of ' + numberHigh + ' people found this helpful</div>');

    });

}