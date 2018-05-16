function registrationInputs(inputs) {

    var inputList = JSON.parse(inputs);

    $.each(inputList, function(index, element) {

        var list = $('<label></label>');
        $('#registration form').append(list);

        if(!element.type) {
            element.type = 'text';
        }

        if(!element.value) {
            element.value = '';
        }

        list.append('' + element.label + '');
        list.append('<input type="' + element.type + '" placeholder="" value="' + element.value + '" />');
    });

}