function getThng(operatorKey, thngId, region) {

	if(region == 'eu') {
		EVT.setup({
		  apiUrl: 'https://api-eu.evrythng.com'
		});
	}

	var operator = new EVT.Operator(operatorKey);

	operator.thng(thngId).read().then(function(thng) {

			if(thng.description == undefined) {
				thng.description = '';
			}

			var thngImg = $('#' + thng.product + '-Product-img').val();

			var productDropdownOptions = createProductDropdown(thng.product, thng.id);
	    	
			// Product Image
			$('#app-screens')
	    	.append('<img class="hero product-img ' + thng.id + '-thng-item" src="' + thngImg + '" />');

	    	// THNG Product
	    	$('#app-screens')
	    	.append('<label for="'+ thng.id +'-Thng-product" class="'+ thng.id +'-thng-item">Use image from product:<span class="admin-dropdown block"><select class="productDropdown" name="' + thng.id + '-Thng-product">' + productDropdownOptions + '</select></span></label>');

	    	if(thng.name) {
				// THNG Title
		    	$('#app-screens')
		    	.append(helperFormField(thng.id, 'Thng-name', ''+ thng.id +'-thng-item', 'Title', thng.name, 'Please enter a title', 'This is the title on most screens.'));
		    }

		    if(thng.description) {
		    	// THNG Description
		    	$('#app-screens')
		    	.append(helperFormField(thng.id, 'Thng-description', ''+ thng.id +'-thng-item thng', 'Description text', thng.description, 'Please enter a description', 'This is the paragraph of text on most screens.'));
		    }

	    	var thngTags = thng.tags;

	    	if(thngTags == undefined) {
				var thngTags = '';
			}

			if(thng.tags) {
		    	// THNG Tags
		    	$('#app-screens')
		    	.append(helperFormField(thng.id, 'Thng-tags', ''+ thng.id +'-thng-item', 'Tags', thngTags, 'No tags for this item', 'Leave these alone!'));
		    }

		    if(thng.customFields) {

		    	var customFields

		    	$.each(thng.customFields, function(customLabel, customValue) {

		    		// Handle pipes - look for numbered customFields
		    		if(customLabel.indexOf("0") >= 0) {

		    			$('#app-screens')
		    			.append(helperFormField(thng.id, 'CustomField-' + customLabel + '', ''+ thng.id +'-thng-item pipedField', customLabel, customValue, '', ''));

		    			var customFieldPipes = customValue;
		    			var customFieldPipesValue = customFieldPipes.split('|');

		    			if(customLabel.indexOf("review") >= 0) {
			    			var fieldsArray = ["Rating (1-5)", "Title", "Name", "Date", "Text"];
			    		}

		    			if(customLabel.indexOf("provenance") >= 0) {
		    				var fieldsArray = ["Name", "Description", "Status (optional color)"];
		    			}

		    			if(customLabel.indexOf("sustainability") >= 0) {
		    				var fieldsArray = ["Icon - <a href=\"https://materialdesignicons.com/\" target=\"_blank\">Get from Material Icons</a> and prefix chosen icon with 'mdi-'", "Title", "Description", "State (open or closed)", "Image (optional)"];
		    			}

		    			if(customLabel.indexOf("timeline") >= 0) {
		    				var fieldsArray = ["Date", "Title", "Location", "Icon (optional) - <a href=\"https://materialdesignicons.com/\" target=\"_blank\">Get from Material Icons</a> and prefix chosen icon with 'mdi-'"];
		    			}

		    			if(customLabel.indexOf("form") >= 0) {
		    				var fieldsArray = ["Label", "Value", "Type (optional)"];
		    			}

		    			if(customLabel.indexOf("previousReward") >= 0) {
		    				var fieldsArray = ["Title", "Date"];
		    			}

		    			if(customLabel.indexOf("reorder") >= 0) {
		    				var fieldsArray = ["Title", "Price", "Image", "Description", "Link"];
		    			}

		    			if(customLabel.indexOf("link") >= 0) {
		    				var fieldsArray = ["Title", "Icon - <a href=\"https://materialdesignicons.com/\" target=\"_blank\">Get from Material Icons</a> and prefix chosen icon with 'mdi-'"];
		    			}

	    				if(fieldsArray) {

	    					var fieldsArrayLength = customFieldPipesValue.length;

			    			$.each(fieldsArray, function( index, value ) {

			    				var styleWrapperClass = 'middlePipedItem';

			    				if(index == 0) {
			    					var styleWrapperClass = 'firstPipedItem';
			    				}

			    				if(index == fieldsArrayLength) {
			    					var styleWrapperClass = 'lastPipedItem';
			    				}

			    				if(jQuery.type( customFieldPipesValue[index] ) === "undefined") {
			    					customFieldPipesValue[index] = '';
			    				}

			    				// Test to see if the field is an Icon one
			    				var isIconField = value.includes("Icon");

			    				var iconPreviewClass = '';

			    				if(isIconField) {
			    					var iconPreviewClass = '' + customFieldPipesValue[index] + ' iconPreview';
			    				}

			    				$('#app-screens')
			    				.append(helperFormField(thng.id, 'PipeField-' + customLabel + '-' + index + '', '' + iconPreviewClass + ' '+ thng.id +'-thng-item ' + styleWrapperClass +'', '' + customLabel + ': ' + value + '', customFieldPipesValue[index], '', ''));

			    				
			    			});

		    			}

		    		// Handle pipes END

		    		} else {

		    			// For non-piped customFields
		    			$('#app-screens')
		    			.append(helperFormField(thng.id, 'CustomField-' + customLabel + '', ''+ thng.id +'-thng-item', customLabel, customValue, '', ''));

		    			// If the THNG has a state we can do some magic to update the app button link
		    			if(customLabel == 'state') {

		    				var previewButtonUrl = $('.view-app-button').attr('href');
		    				var previewStateParams = '&state=' + customValue +'&thng=' + thng.id + '';
		    				var newPreviewButtomUrl = previewButtonUrl.concat(previewStateParams);
		    				$('.view-app-button').attr('href', newPreviewButtomUrl).html('View Screen');

		    				// QR Code Magic if the THNG has a state
							var url = 'https://tn.gg/redirections?evrythngId=' + thngId;
							var xhr = new XMLHttpRequest();

							xhr.onreadystatechange = function() {

							  if(this.readyState == 4 && this.status == 200) {
							    var redirections = JSON.parse(this.responseText);
							    var shortId = redirections[0].shortId;
							    if(shortId){
							    	$('.product-img.' + thngId + '-thng-item').after('<img src="https://tn.gg/' + shortId + '.png?w=300&h=300&tpl=default" class="thng-qr-img" />');
							    }
							    

							  }

							};

							xhr.open('GET', url, true);
							xhr.setRequestHeader('Content-Type', 'application/json');
							xhr.setRequestHeader('Authorization', operatorKey);
							xhr.send();
							// QR Code

		    			} else {

		    				helperRemoveStateThngFromPreviewButton();

		    			}

		    		}
		    		

		    	});

			}

	    	$('.'+ thng.id +'-thng-item').wrapAll('<div id="' + thng.id + '" class="admin-section thngSection active"></div>');

	});
}