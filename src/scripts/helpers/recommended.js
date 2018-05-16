// Recommended List from Tag
function getRecommendedList(user) {
    user.thng().read(filterByTag('Recommended')).then(function(thngs) {
            thngs.map(function(thng) {
                getRecommendedThngs(user, thng);
            })
    });
   
}

// Populate Recommendations
function getRecommendedThngs(user, thng) {

    user.product(thng.product).read().then(function(product) {

            var list = $('<div class="recommended__item"></div>');

            if (thng.customFields.price) {
                var price = thng.customFields.price;
            } else {
                var price = cfg.defaultProductCost;
            }

            if (thng.customFields.rating) {
                var rating = thng.customFields.rating;
            } else {
                var rating = '3';
            }

            list.append('<a href="#" class="recommended__link"><span class="recommnded__img"><img src="' + product.photos[0] + '" /></span><span class="recommended__text"><span class="recommended__title">' + thng.name + '</span><span class="recommended__cost">' + price + '</span><div class="star-rating">' + formatRating(rating) + '</div></span></span></a>');

            $('.recommended_items').append(list);

    });

}