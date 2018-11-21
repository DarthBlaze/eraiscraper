const fs = require('fs');

writeJsonToDisk = (name, data) => {
    fs.writeFile(name, data, 'utf8', function(error) {
        console.error(error);
    });
}

module.exports = writeJsonToDisk;