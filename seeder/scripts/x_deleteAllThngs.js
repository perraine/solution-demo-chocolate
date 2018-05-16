// USED when you screwed up a load //

'use strict';

const config = require('evt-config');
let cfg = {};

config
  .get('kidger-demo')
  .then(settings => {
    // now do my other stuff
    console.log(settings);
    cfg = settings;
    getAllThngs();
  })
  .catch(err => {
    console.log('Error getting Configuration : ' + JSON.stringify(err));
  });

function getAllThngs() {
  const EVT = require('evrythng-extended');
  EVT.setup({
    apiUrl: cfg.apiUrl
  });
  const operator = new EVT.Operator(cfg.operatorKey);

  let it = operator.thng().iterator(evtParms());

  EVT.Utils
    .forEachAsync(it, function(val) {
      val.forEach(function(thng) {
        deleteThngs(thng);
      });
    })
    .catch(err => {
      console.log(err);
    });

  function deleteThngs(t) {
    console.log(t.name, t.id);
    operator.thng(t.id).delete();
  }

  function evtParms() {
    return { params: { perPage: 100, filter: {}, project: cfg.projectId } };
  }
}
