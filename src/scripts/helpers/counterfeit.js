// Provenance - data object defined in customFields.js
// ***************
function invalidCode(response) {
  console.log('Invalid QR Code is ' + response.value);
  console.log('Add Action to the Dashboard');
  addInvalidQRCodeScan(response.value);
}

// Add Unrecognised Code Scan to Dashboard
function addInvalidQRCodeScan(code) {
  console.log(appCustomFields);
  getUser(evtAppId).then(user => {
    console.log('user' + user);
    user.action('_UnrecognisedCode').create({ tags: [code] });
  });

  if (appCustomFields.showCounterfeitScreen === 'true') {
    console.log('show counterfeit');
    evtCounterfeitMessages.message = 'An Invalid Code was detected : ' + code;
    counterfeitRedirect('Fake')
  } else {
    $('.error-msg').html(appCustomFields.defaultCounterfeitMessage);
  }
}
