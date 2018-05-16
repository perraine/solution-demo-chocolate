function updateProduct(user, productId){

	user.product(productId).read().then(function(product) {

		product.name = $('#' + productId + '-Product-name').val();
		product.img = $('#' + productId + '-Product-img').val();

		product.update({
			name: product.name,
			photos: [product.img]
		});

	});

}