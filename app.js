const request = require('request');
const config = require('./src/config/config');
const buildStructure = require('./src/buildStructure');
const writeJsonToDisk = require('./src/writeJsonToDisk')

var items = [];

console.time("dbsave");

request.get(config.url, (_error, _response, body) => {

    if (_error) {
        console.error(_error);
        return;
    }
    items = buildStructure(body);
    console.log(items)
    writeJsonToDisk('erai-anime2.json', JSON.stringify(items));

    console.timeEnd("dbsave");
});