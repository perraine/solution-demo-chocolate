// Product List from Tag
function getOwnedThngs(user) {

    user.thng().read(filterByTag('Purchased')).then(function(thngs) {
        thngs.map(function(thng) {
            addThngToPurchasedList(thng, user);
        })
    })

}

// Populate purchase list from THNGs with 'Purchase' Tag
function addThngToPurchasedList(thng, user) {

    user.product(thng.product).read().then(function(product) {

        var list = $('<li></li>');

        $('.purchase-list').append(list);

        if (thng.customFields.price) {
            var price = thng.customFields.price;
        } else {
            var price = 'PLEASE SET PRICE';
        }

        list.append(
            '<div class="img" style="background-image:url(' + product.photos[0] + ');"></div> <span class="prod-list-name">' + thng.name + '</span><span class="prod-list-price">Price <span class="value">' + price + '</span></span>'
        );

        if (thng.customFields.rating) {
            var rating = thng.customFields.rating;
        } else {
            var rating = '3';
        }

        list.append('<a href="#" class="prod-list-rating" onclick="return false;">' + formatRating(rating) + '</a>');

        if (thng.customFields.offer === "true") {
            list.append('<span class="prod-list-offer">- On Offer</span>')
        }

    });

}
// Purchase List END
