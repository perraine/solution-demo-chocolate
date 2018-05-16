// Function to check presence of anonymous user id and api key, or creation of anonymous user id & api key
function getUser(appId) {
    
    const apiKeyStorageKey = ''+ appId + '-apiKey';
    const idStorageKey = ''+ appId + '-userId';

    let id = localStorage.getItem(idStorageKey);
    let apiKey = localStorage.getItem(apiKeyStorageKey);

    if (apiKey) {

        return (new EVT.User({ id, apiKey })).$init;

    } else {

        return app.appUser()
        .create({ anonymous: true })
        .then(user => {
            localStorage.setItem(idStorageKey, user.id);
            localStorage.setItem(apiKeyStorageKey, user.apiKey);
            return user;
        });

    }
  
}