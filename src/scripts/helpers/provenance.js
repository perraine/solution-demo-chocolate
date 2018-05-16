// Provenance - data object defined in customFields.js
// ***************
function showProvenance(provenance) {

    var provenanceList = JSON.parse(provenance);

    $.each(provenanceList, function(index, element) {
        var list = $('<li class="provenance-item cf"></li>');

        var statusdot = '';

        if(element.status) {
            var statusdot = '<span class="list-status-dot" style="background-color:' + element.status + ';"></span>'
        }
        $('.information-items').append(list);
        list.append('<span class="list-name">' + element.name + '</span><span class="list-value">' + statusdot + '' + element.description + '</span>');
    });

}