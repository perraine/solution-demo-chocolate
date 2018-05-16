function saveAppData(appKey, opKey, projectId, appId, region, screenId) {

	$('body').addClass('saving');

	if(region == 'eu') {
		EVT.setup({
		  apiUrl: 'https://api-eu.evrythng.com'
		});
	}

	var app = new EVT.App(appKey);
	var operator = new EVT.Operator(opKey);

	if(screenId == 'config-brand-colors') {

		var appName = $('#app-name').val();
		var appLogo = $('#app-logo').val();
		var appBanner = $('#app-banner').val();
		var appBannerTxt = $('#app-banner-txt').val();

		// Modal Titles
		var modalInformation = $('#modal-information').val();
		var modalVideo = $('#modal-video').val();
		var modalReviews = $('#modal-reviews').val();
		var modalTimeline = $('#modal-timeline').val();
		var modalRedeem = $('#modal-redeem').val();
		var modalReorder = $('#modal-reorder').val();

		// Get any additional customFields
		var additionalCustomFields = {};

		// Check customFields first
		var test = $('.additionalAppCustomFields input').each(function() {

			var appCustomFieldInput = $(this).attr("name");
	        var appCustomFieldAttr = appCustomFieldInput.split('-');
	        var appCustomFieldLabel = appCustomFieldAttr[0];
	        var appCustomFieldValue = $(this).val();

	        additionalCustomFields[appCustomFieldLabel] = appCustomFieldValue;

		});

		var additionalAppcustomFields = $.each(additionalCustomFields, function (index, value) {
		    index + ' : ' + value;
		});

		var setAppCustomFields = {
			bannerBrand: appLogo,
			bannerColor: appBanner,
			bannerTextColor: appBannerTxt,
			modalTitleInformation: modalInformation,
			modalTitleVideo: modalVideo,
			modalTitleReviews: modalReviews,
			modalTitleTimeline: modalTimeline,
			modalTitleRedeem: modalRedeem,
			modalTitleReorder: modalReorder
		}

		var allAppCustomFields = $.extend({}, additionalAppcustomFields, setAppCustomFields);

		operator.project(projectId).application(appId).update({

			name: appName,
			customFields: allAppCustomFields

		}).then(function (updatedApp) {

			toaster('App Information Saved');

		}, function(error){

			toaster('Error updating App Information', 'error');

		});

	} else if(screenId == 'products') {

		app.product().read().then(function (products) {

		    $.each(products, function(index, product) {

		    	updateProduct(operator, product.id);

		    })

		}).then(function(updatedProduct) {

			toaster('Product Information Saved');

		}, function(error){

			toaster('Error updating Product Information', 'error');

		});


	} else {

		updateThng(operator, screenId);

	}

	

	
	
}