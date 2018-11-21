const fs = require('fs');

var configJsonFileContents = fs.readFileSync('config.json');

var config = JSON.parse(configJsonFileContents);

module.exports = config;