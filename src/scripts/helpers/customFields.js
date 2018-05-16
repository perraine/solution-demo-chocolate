// customField to Object mapping
// ***************
function buildCustomFieldObject(array, template) {

    if(template == 'provenance') {
      return { 
        name: array[0],
        description: array[1],
        status: array[2]
      }
    }

    if(template == 'review') {
      return { 
        rating: array[0],
        title: array[1],
        name: array[2],
        date: array[3],
        text: array[4]
      }
    }

    if(template == 'sustainability') {
      return { 
        icon: array[0],
        title: array[1],
        description: array[2],
        state: array[3],
        img: array[4]
      }
    }

    if(template == 'timeline') {
      return { 
        date: array[0],
        title: array[1],
        location: array[2],
        icon: array[3]
      }
    }

    if(template == 'form') {
      return { 
        label: array[0],
        value: array[1],
        type: array[2]
      }
    }

    if(template == 'previousReward') {
      return { 
        title: array[0],
        date: array[1]
      }
    }

    if(template == 'reorder') {
      return { 
        title: array[0],
        price: array[1],
        img: array[2],
        description: array[3],
        link: array[4]
      }
    }

    if(template == 'link') {
      return { 
        title: array[0],
        icon: array[1]
      }
    }

    if(template == 'bespokeAlert') {
      return { 
        title: array[0],
        message: array[1],
        button: array[2]
      }
    }

}

// Take Object mapping and create JSON from customField item(s)
// ***************
function customFieldArrayToJson(fieldprefix, thng){

    var buildObjectTemplate = fieldprefix;

    return JSON.stringify(Object.keys(thng)
        .filter(key => key.startsWith(fieldprefix))
        .map(fieldprefix => {
            return buildCustomFieldObject(escapeHtml(thng[fieldprefix]).split('|'), buildObjectTemplate);
        })
    );

};