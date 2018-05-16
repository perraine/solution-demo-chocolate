function processThngFields(thngId) {

	var customFieldsObj = {};

	// Check customFields first
	$('input[name*=' + thngId + '-CustomField]').each(function() {

		var thngInput = $(this).attr("name");
        var thngAttr = thngInput.split('-');
        var thngLabel = thngAttr[2];
        var thngValue = $(this).val();

        customFieldsObj[thngLabel] = thngValue;

	});

	var customFields = $.each(customFieldsObj, function (index, value) {
	    index + ' : ' + value;
	});

	var standardThngObj = {};

	// Handle the other Thng fields (don't look JUST for inputs as we can target select for product as well)
	$('[name*=' + thngId + '-Thng]').each(function() {

		var thngInput = $(this).attr("name");
        var thngAttr = thngInput.split('-');
        var thngLabel = thngAttr[2];
        var thngValue = $(this).val();

        if(thngLabel == 'tags') {

        	var tagCount = thngValue.split(',').length;

        	if(tagCount == 1) {

        		standardThngObj[thngLabel] = ['' + thngValue + ''];

        	} else {

        		standardThngObj[thngLabel] = thngValue.split(',');

        	}

        } else {

        	standardThngObj[thngLabel] = thngValue;

        }


    });

    var standardFields = $.each(standardThngObj, function (index, value) {
	    index + ' : ' + value;
	});

	return [customFields, standardFields];

}