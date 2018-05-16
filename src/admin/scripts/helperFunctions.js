function helperClearUI(){

	$('#project-id, #app-id, #config-brand-colors input, #app-name').val('');
	$('#app-screens div').not('#config-brand-colors, #config-brand-colors .half-inputs, .brand, .brand-img').remove();
	$('#app-screen-select option').not("option[value='config-brand-colors']").remove();

};

function helperFormField(classId, classRef, classType, title, value, placeholder, hint) {

	// Create <textarea> instead of input
	if(classRef == 'Thng-description') {

		return '<label for="' + classId + '-' + classRef + '" class="' + classType + '">' + title + '<textarea id="' + classId + '-' + classRef + '" class="' + classId + '-' + classRef + '" name="' + classId + '-' + classRef + '" value="" placeholder="' + placeholder + '">' + value + '</textarea><span class="hint">' + hint + '</span></label>';

	} else {

		return '<label for="' + classId + '-' + classRef + '" class="' + classType + '">' + title + '<input type="text" id="' + classId + '-' + classRef + '" class="' + classId + '-' + classRef + '" name="' + classId + '-' + classRef + '" value="' + value + '" placeholder="' + placeholder + '" /><span class="hint">' + hint + '</span></label>';

	}

}

function helperUnlockUI(region) {

	$('.admin-setup-fields').addClass('processed');
	$('.admin-reset-button, .admin-app-title-controls, .admin-actions, .view-app-button').addClass('on');

	$('#app-screen-select').val('config-brand-colors');
	$('#config-brand-colors').addClass('active');

	// Set the URL on the App Preview
	var appPreviewUrl = 'https://evt-sol-demos-02.netlify.com'; // https://evt-admin-test.netlify.com
	var appKey = $('#user-app-key').val();

	$('.view-app-button').attr('href', '' + appPreviewUrl + '?appKey=' + appKey + '&region=' + region + '');
}

function helperLiveClassUI(inputId, targetItem, classId, defaultValue) {

	$(inputId).bind('input', function(){

		var value = $(this).val();

		if(classId == 'background-image') {

			if(value == '') {

				$(targetItem).css(classId, 'url(' + defaultValue + ')');

			} else {

				$(targetItem).css(classId, 'url(' + value + ')');

			}

		} else {

			if(value == '') {

			$(targetItem).css(classId, defaultValue);

			} else {

				$(targetItem).css(classId, value);

			}

		}

	});

}

function helperLiveElementUI(inputId, targetItem, attribute) {

	$(inputId).bind('input', function(){

		var value = $(this).val();

		$(targetItem).attr(attribute, value);

	});

}

function helperRemoveStateThngFromPreviewButton() {
	var previewButtonUrl = $('.view-app-button').attr('href');
	var previewStateParamsTrimmed = previewButtonUrl.replace(/&state.*/,'');
	$('.view-app-button').attr('href', previewStateParamsTrimmed).html('View App');
}

function helperGetParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var toasterTimer;
function toaster(message, type) {

    clearTimeout(toasterTimer);

    $('.toaster').removeClass("error, warning");

    if (type) {

        $('.toaster').addClass(type);

    }

    $('.toaster__message').html(message);
    $('.toaster').addClass('on');

    $('body').removeClass('saving');

    toasterTimer = setTimeout(function() {

        $('.toaster').removeClass('on');

    }, 4000);

}