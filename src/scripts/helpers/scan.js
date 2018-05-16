// SCANTHNG
EVT.use(EVT.Scan);

function scanProduct() {
  // Clear any previous error message
  $('.error-msg').html('');
  $('.loader').addClass('on');

  app
    .scan({
      filter: 'method=2d&type=qr_code'
    })
    .then(res => {
      if (res[0].meta.score === 0) {
        // is a valid QR code but we dont have it in our sustem
        console.log('Invalid code sent to Evrythng :' + res[0].meta.value);
        invalidCode(res[0].meta);
      } else {
        let result = res[0].results[0];

        // Redirect to the first redirection set on the resource
        app.redirect(result.redirections[0]);
      }
    })
    .catch(error => {
      // Report an error
      console.log(error);
      $('.error-msg').html(
        'Sorry - there was an error scanning this code... please try again.'
      );
    })
    .then(() => {
      $('.loader').removeClass('on');
    });
}
