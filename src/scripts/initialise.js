// Global set-up: the THNG ID and State from the URL so we can read the THNG via the API
// Also set our App ID, API Key and Region
// Sample URL for Admin Defaults: ?thng=UF44tsggMGPhhMaaRDcGSEfc&state=offer&appKey=0JKSNDSBpv0qlYKjai8PBprl5ROuCkBUXJsiqMlZnfDflii6xq0Ww0Y6Fidzwpvr7vjUvV6RWy1BvSdS
// ***************

var evtAppId = '';
var appCustomFields = {};
var evtCounterfeitMessages = {};
var productCustomFields = {};

var thngId = getParameterByName('thng'),
  state = getParameterByName('state'),
  appKey = getParameterByName('appKey'),
  region = getParameterByName('region');

// Provide simple feedback if there is no appKey
// ***************
if (!appKey) {
  alert('No Application Key Detected in URL');
  console.log('Add the application key to the URL using ?appKey=');
}

// Fall-back if no STATE found in URL
// ***************
if (!state) {
  $('body').addClass('start');
}

// Allow API URL variations (defaults to US)
// ***************
if (region == 'eu') {
  EVT.setup({
    apiUrl: 'https://api-eu.evrythng.com'
  });
}

// Set global app variable using Application API Key
// ***************
var app = new EVT.App(appKey);

// Once App variable set then process THNG and App config
// ***************
app.$init.then(app => {
  // Get the title from the App Name
  var appTitle = app.name;
  document.title = appTitle;

  // Create var for app ID to create session objects
  var appId = app.id;
  evtAppId = app.id;
  appCustomFields = app.customFields;

  // Styling/Branding
  var appBannerBackground = app.customFields.bannerColor;
  var appBannerColor = app.customFields.bannerTextColor;
  var appBannerBrand = app.customFields.bannerBrand;

  // Style the app
  styleApp(appBannerBackground, appBannerColor, appBannerBrand);
  modalTitles(app.customFields.modalTitleInformation, app.customFields.modalTitleVideo, app.customFields.modalTitleReviews, app.customFields.modalTitleTimeline, app.customFields.modalTitleRedeem, app.customFields.modalTitleReorder);


  // Menu localStorage item reference
  var appMenu = localStorage.getItem('' + appId + '-appMenuConfig');

  // Check we have the menu and action mappings
  if (appMenu === null) {
    // Generate the App menu and action mappings
    buildMenu(appId);
    // App will reload the app with menu and action mappings in place
  } else {
    // Load app menu
    loadAppMenu(appMenu);
    // Load THNG
    loadThng(appId, appMenu);
  }
});
