function getProducts(app){

	app.product().read().then(function (products) {

		$('#app-screen-select').append('<option value="products">Products</option><option disabled value="blankSeperator"></option><option disabled value="titleOwnedItems">OWNED ITEMS</option><option disabled value="blankSeperator"></option><option disabled value="titleAppScreens">APP SCREENS</option>');

	    $.each(products, function(index, product) {

	    	if(product.photos) {

	    		if(product.photos[0] == 'null') {

	    			var productImg = '';

	    		} else {

	    			var productImg = product.photos[0];

	    		}

	    	} else {

	    		var productImg = '';

	    	}

	    	$('#app-screens')
	    	.append('<img id="' + product.id + '" class="hero product-img product-item" src="' + productImg + '" />');

	    	$('#app-screens')
	    	.append(helperFormField(product.id, 'Product-name', 'product-item', 'Product Name', product.name, 'Please enter a Product title', ''));

	    	$('#app-screens')
	    	.append(helperFormField(product.id, 'Product-img', 'product-item', 'Product Image', productImg, 'Please enter a Product image', 'Image size is a square (300px x 300px) PNG image (<a href="http://imageresize.org/" target="_blank">cropping tool</a>) - make sure you link to a https:// image URL via an image hosting website.'));


	    });

	    $('.product-item').wrapAll('<div id="products" class="admin-section"></div>');

	});

};