// Generate Menu JSON: localStorage
// ***************

function buildMenu(appId) {

    var appMenuConfig = ''+ appId + '-appMenuConfig';

    getUser(appId)
    .then(user => {
        user.thng().read().then(function(thngs) {

            console.log(thngs);

            var fixedThngs = $.map(thngs,function(thng){
              return {
                state: thng.customFields.state,
                thng: thng.id,
                label: thng.customFields.menuLabel,
                actionType: thng.customFields.actionType
              }
            });

            var appMenu = JSON.stringify(fixedThngs);
            localStorage.setItem(appMenuConfig, appMenu);
            location.reload();

        });


  });
}
// Get Thngs tagged Menu
function applyFilter() {
  return { params: { filter: { tags: ['Menu'] } } };
}
