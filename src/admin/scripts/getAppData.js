// Get App Data
function getAppData(appKey, opKey, region) {

	if(region == 'eu') {
		EVT.setup({
		  apiUrl: 'https://api-eu.evrythng.com'
		});
	}

	var app = new EVT.App(appKey);
	var operator = new EVT.Operator(opKey);

	app.$init
	.then(app => {

		// Get all our App Stuff
		$('#app-name').val(app.name);
		$('#app-logo').val(app.customFields.bannerBrand);
		$('#app-banner').val(app.customFields.bannerColor);
		$('#app-banner-txt').val(app.customFields.bannerTextColor);
		$('#modal-information').val(app.customFields.modalTitleInformation);
		$('#modal-video').val(app.customFields.modalTitleVideo);
		$('#modal-reviews').val(app.customFields.modalTitleReviews);
		$('#modal-timeline').val(app.customFields.modalTitleTimeline);
		$('#modal-redeem').val(app.customFields.modalTitleRedeem);
		$('#modal-reorder').val(app.customFields.modalTitleReorder);

		// Get additional / per-app custom fields
		$.each(app.customFields, function(customLabel, customValue) {

			if(!(
				customLabel == 'bannerBrand' || 
				customLabel == 'bannerColor' || 
				customLabel == 'bannerTextColor' || 
				customLabel == 'modalTitleInformation' ||
				customLabel == 'modalTitleVideo' ||
				customLabel == 'modalTitleReviews' ||
				customLabel == 'modalTitleTimeline' ||
				customLabel == 'modalTitleRedeem' || 
				customLabel == 'modalTitleReorder'
			)) {
				$('.additionalAppCustomFields')
	    		.append(
	    			helperFormField(customLabel, customLabel, customLabel, customLabel, customValue, '', 'Please only change with support')
	    		);
			} else {
				// nothing
			}

		});

		if(app.customFields.bannerBrand) {
			$('.brand-img').css('background-image', 'url(' + app.customFields.bannerBrand + ')');
		}

		if(app.customFields.bannerColor) {
			$('.global-header').css('background', app.customFields.bannerColor);
		}

		if(app.customFields.bannerTextColor) {
			$('.global-controls').css('color', app.customFields.bannerTextColor);
		}
		
		// Store the projectId and appId for saving/updating
		$('#project-id').val(app.project);
		$('#app-id').val(app.id);

		getThngsDropdown(operator, app.project, region);

	}, function(error){

		$('#admin-setup-details').removeClass('submitted');
		toaster('Please check your AppKey', 'error');
		
	});

	getProducts(app);
	
	return false;
};