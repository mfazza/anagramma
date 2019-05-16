var mongoModule = require('./mongomodule');
var fs = require("fs");
var datastore = JSON.parse(fs.readFileSync("datastore.json"));
const tools = require('./tools');


Object.keys(datastore).forEach(function (key) {
    tools.postMongoDBInitial(key, data[key])
})