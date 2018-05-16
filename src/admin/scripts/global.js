// https://imgur.com/a/h39gi - Admin UI images

// Populate App Key from URL
var appKeyParam = helperGetParameterByName('appKey');
var opKeyParam = helperGetParameterByName('opKey');

if(appKeyParam) {
	$('#user-app-key').val(appKeyParam);
}
if(opKeyParam) {
	$('#user-op-key').val(opKeyParam);
}

// Download App Information
$('#admin-setup-details').submit(function(){

	if($(this).hasClass('submitted')) {

		return false;

	} else {

		// Prevent double submit
		$(this).addClass('submitted');

		// Clear everything on screen first
		helperClearUI();

		// Get the details of the newly entered stuff
		var opKey = $('#user-op-key').val();
		var appKey = $('#user-app-key').val();

		if(opKey && appKey) {

			var appApiRegion = $('input[name="user-api-region"]:checked').val();

			// Get the App Settings, Products and THNGs
			getAppData(appKey, opKey, appApiRegion); // UI Unlocked after getThngsDropdown() is executed.

		} else {

			toaster('Please enter Operator and App Keys', 'error');
			$('#admin-setup-details').removeClass('submitted');

		}

		return false;

	}

	
});

// Dropdown Nav
$("#app-screen-select").change(function () {

	var activeScreen = "";

    $('#app-screen-select option:selected').each(function() {

		var activeScreen = $(this).val();

		$('.admin-section').removeClass('active');
		$('.thngSection').remove();

		if(activeScreen == 'config-brand-colors' || activeScreen == 'products' || activeScreen == 'default') {

			$('#' + activeScreen + '.admin-section').addClass('active');

			// Remove dynamic URL update to preview button and revert to app landing screen
			helperRemoveStateThngFromPreviewButton();

		} else {

			// Get the details of the newly entered stuff
			var opKey = $('#user-op-key').val();
			var thngId = activeScreen;
			var appApiRegion = $('input[name="user-api-region"]:checked').val();

			getThng(opKey, thngId, appApiRegion);

		}

	});

}).change();

// Update Product Image on dropdown change
$(document).on('change', '.productDropdown', function(){

	var selectedProduct = $(this).val();

	var thngAttrProduct = $(this).attr('name');
	var thngObjProduct = thngAttrProduct.split('-');
	var thngProduct = thngObjProduct[0];

	var productImage = $('#' + selectedProduct + '-Product-img').val();

	// Update Image
	$('.product-img.' + thngProduct + '-thng-item').attr('src', productImage);

});

// Branding live preview
helperLiveClassUI('#app-logo', '.brand-img', 'background-image', '//i.imgur.com/BzHgU4e.png');
helperLiveClassUI('#app-banner', '.global-header', 'background', '#EA000A');
helperLiveClassUI('#app-banner-txt', '.global-controls', 'color', 'white');

// Toogle Advanced App Options
$('.appAdvancedOptions').click(function(){

	$(this).toggleClass('on');
	$('.app-advanced-options').toggleClass('on');

	return false;

});

// Sticky Header Movement
$(window).scroll(function() {

  var windscroll = $(window).scrollTop();

  if (windscroll >= 125) {
    $('.admin-sticky-nav, #app-screens').addClass('flush');
  } else {
    $('.admin-sticky-nav, #app-screens').removeClass('flush');
  }

}).scroll();

// Icon live preview
$(document).on('keyup input contextmenu', '.iconPreview input', function(){

	var newIcon = $(this).val();

	var firstIconClass = $(this).parent('label').attr('class').split(' ').shift();

	// Check to see if it contains 'mdi-'
	var firstIsMaterialIcon = firstIconClass.includes("mdi-");

	// Remove 'mdi-' class
	if(firstIsMaterialIcon) {
		$(this).parent('label').removeClass(firstIconClass);
	}

	// Create new classes and add new one to front of class string
	var classes = $(this).parent('label').attr("class").split(" ");
	classes.unshift(newIcon);
	var newClasses = classes.join(" ");

	$(this).parent('label').attr('class', newClasses);

});

// Product image live preview
$(document).on('keyup input contextmenu', '[name*=Product-img]', function(){

	var productImgValue = $(this).val();
	var productImgInputString = $(this).attr('name');
	var productId = productImgInputString.split('-');

	$('#' + productId[0] + '').attr('src', productImgValue);

});

// Auto-update pipe fields via seperate fields
$(document).on('keyup input contextmenu', '[name*=PipeField]', function(){

	var customFieldString = $(this).attr('name');
	var customFieldObj = customFieldString.split('-');

	var customFieldThngId = customFieldObj[0];
	var customFieldLabel = customFieldObj[2];

	var allPipedFieldsMatched = '' + customFieldObj[0] + '-PipeField-' + customFieldObj[2] + '';

	var customFieldInput = '' + customFieldObj[0] + '-CustomField-' + customFieldObj[2] + '';

	var updatedValue = $('[name*=' + allPipedFieldsMatched +']').map( function() {
	    return $(this).val();
	}).get().join('|');

	$('#' + customFieldInput + '').val(updatedValue);

});

// Saving App Screen
$('.admin-actions').on("click", ".save", function(){

	var appKey = $('#user-app-key').val();
	var opKey = $('#user-op-key').val();
	var projectId = $('#project-id').val();
	var appId = $('#app-id').val();
	var appApiRegion = $('input[name="user-api-region"]:checked').val();

	var saveScreenId = $('.admin-section.active').attr('id');

	saveAppData(appKey, opKey, projectId, appId, appApiRegion, saveScreenId);

	return false;

});

// Reset/'Start Again' App
$('.admin-reset-button').click(function (){

	helperClearUI();

	$('#admin-setup-details').removeClass('submitted');

	$('.admin-setup-fields').removeClass('processed');
	$('.admin-reset-button, .admin-app-title-controls, .admin-actions, .view-app-button').removeClass('on');

	$('#user-op-key, #user-app-key').val('');
	$('#app-screen-select').val('');
	$('#config-brand-colors').removeClass('active');

});