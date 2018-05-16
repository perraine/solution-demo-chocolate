function getThngsDropdown(operator, projectId, region) {

	operator.thng().read({
	params: {
		project: projectId
	}
	}).then(function(thngs) {

		$.each(thngs, function(index, thng) {

			// Make Menu more meaningful
			if(thng.customFields.menuLabel) {

				var thngMenuLabel = thng.customFields.menuLabel;

			} else {

				var thngMenuLabel = 'Owned Item: ' + thng.name + '';

			}

			// Front-load the Products in dropdown - if there are any
			if(thngMenuLabel.indexOf("Owned Item") >= 0) {

				$('<option value="' + thng.id + '">' + thngMenuLabel + '</option>').insertAfter('#app-screen-select option[value="titleOwnedItems"]');

			} else {

				$('#app-screen-select').append('<option value="' + thng.id + '">' + thngMenuLabel + '</option>');

			}

	    });


		// Unlock the UI for editing
		helperUnlockUI(region);


	}, function(error){

		toaster('There appears to be a problem with your OperatorKey', 'error');
		$('#admin-setup-details').removeClass('submitted');

	});
}