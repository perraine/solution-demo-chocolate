const csvFilePath = "../data/simplemaps-worldcities-basic.csv";
const csv = require("csvtojson");
let newJsonFile = [];
csv()
  .fromFile(csvFilePath)
  .on("json", jsonObj => {
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
    newJsonFile.push(jsonObj);
  })
  .on("done", error => {
    console.log(JSON.stringify(newJsonFile));
  });
