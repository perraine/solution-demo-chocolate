$(".counterfeitcheck-form").submit(function() {
  var values = $(this).serialize();

  console.log("color=" + productCustomFields.color);
  if (values == "color=" + productCustomFields.color) {
    console.log("Is Genuine");
    // Need to replace this with a generic URL
    counterfeitRedirect("Genuine");
  } else {
    console.log("Is Counterfeit");
    counterfeitRedirect("Fake");
  }

  return false;
});
