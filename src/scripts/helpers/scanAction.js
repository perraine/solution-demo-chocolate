// Add a scan when invoked from native QR Code Reader or NFC
// ***************
function addScanToThng(thngId, scanType, appId, user) {

    return user.thng(thngId).read()
    .then(function(thng) {

        return thng.action(scanType).create({
            customFields: {
                ExternalScan: true
            }
        }).then(function(scan) {
            localStorage['locationRegion'] = scan.context.region;
            localStorage['locationCity'] = scan.context.city;
        });
        
    });
    
}

function getActionTypeFromState(state, appMenu) {

    // action Type / State mapping is in the cfg object
    var appMenuJson = JSON.parse(appMenu);
    var foundState = appMenuJson.filter(function (stateActionMap) {
        if (stateActionMap.state === state) return stateActionMap;
    });

    if (foundState.length > 0) {

        return foundState[0].actionType;

    } else {

        return 'scans';
        
    }
}

// Add Scan to Dashboard relevant to state
function addScanBasedOnState(thngId, state, appId, appMenu, user) {
    return addScanToThng(thngId, getActionTypeFromState(state, appMenu), appId, user);
}