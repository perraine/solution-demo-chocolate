function updateThng(user, thngId){

	var thngFields = processThngFields(thngId);
	var thngCustomFields = thngFields[0];
	var thngStandardFields = thngFields[1];

	// Make our customFields object
	var customFields = {customFields: thngCustomFields};

	// Join them together!
	var thngDocument = $.extend({}, customFields, thngStandardFields);

	user.thng(thngId).update(thngDocument).then(function(updatedThng) {

  		toaster('App Page Updated');

	}, function(error){

		console.log(error);
		toaster('Error Updating App Page');

	});

}