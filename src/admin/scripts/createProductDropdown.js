function createProductDropdown(activeProduct) {
        
	var list = '';

	// Build Products Object
	$('input[name*=Product-name]').each(function() {

		var productInput = $(this).attr("name");
                var productAttr = productInput.split('-');
                var productId = productAttr[0];
                var productTitle = $(this).val();

        if(productId == activeProduct) {
        	
        	list += '<option value="' + productId + '" selected="selected">' + productTitle + '</option>';

        } else {

        	list += '<option value="' + productId + '">' + productTitle + '</option>';

        }
        
	});

	return list;

};