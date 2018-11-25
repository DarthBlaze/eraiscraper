const syncrequest = require("sync-request");
var $ = require("cheerio");
const URL = require("url");

var cloudscraper = require('cloudscraper');


animeData = async(_url, _userAgent) => {
    return new Promise((resolve, reject) => {
        console.time("x")
        var url = _url || "https://srv01.erai-ddl.info/";

        // var body = syncrequest("GET", url, {
        //     headers: {
        //         "user-agent": _userAgent
        //     }
        // }).getBody("utf-8");
        // return buildStructure(body, url);
        cloudscraper.get(url, function(error, response, body) {
            if (error) {
                reject(console.log(error));
            } else {
                console.log(body)
                resolve(buildStructure(body, url));
            }
        });
    });
};

buildStructure = (html, url) => {
    const rawItems = $("#directory-listing > li", html);
    const itemsAmount = rawItems.length;
    const _url = URL.parse(url);
    const _items = [];
    for (let i = 0; i < itemsAmount; i++) {
        if (rawItems[i].attribs["data-name"].trim() != "..") {
            var isFolder =
                $("a > div > span.file-name > i", rawItems[i])[0].attribs.class.indexOf(
                    "fa-folder"
                ) > -1;

            _items.push({
                Name: rawItems[i].attribs["data-name"].replace(
                    /(\[(.*?)\])|(.mkv)/g,
                    ""
                ),
                Href: isFolder ?
                    "" : "https://" + _url.hostname + "/" + rawItems[i].attribs["data-href"],
                Size: $("a > div > span.file-size", rawItems[i])
                    .text()
                    .trim(),
                Type: isFolder ? "folder" : "video",
                Child: isFolder ?
                    "https://" + _url.hostname + "/" + rawItems[i].attribs["data-href"] : "",
                Resolution: rawItems[i].attribs["data-name"].match(
                    /(480p|720p|1080p)/g
                )
            });
        }
    }
    return _items;
};

exports = module.exports = animeData;