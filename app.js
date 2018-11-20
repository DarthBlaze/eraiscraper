const request = require('request');
const syncrequest = require('sync-request');
const $ = require('cheerio');
const URL = require('url');

const url = 'https://srv01.erai-ddl.info/?dir=2017/Old%20Anime';
var items = [];

console.time("dbsave");
request.get(url, (error, response, body) => {
    items = buildStructure(body);
    //console.log(JSON.stringify(items));
    console.timeEnd("dbsave");
});

buildStructure = (html) => {
    const rawItems = $('#directory-listing > li', html);
    const itemsAmount = rawItems.length;
    const _url = URL.parse(url);
    const _items = [];
    for (let i = 0; i < itemsAmount; i++) {
        if (rawItems[i].attribs['data-name'].trim() != '..') {
            var isFolder = $('a > div > span.file-name > i', rawItems[i])[0].attribs.class.indexOf('fa-folder') > -1;

            _items.push({
                'name': rawItems[i].attribs['data-name'],
                'href': rawItems[i].attribs['data-href'],
                'size': $('a > div > span.file-size', rawItems[i]).text().trim(),
                'type': isFolder ? 'folder' : 'video',
                'childs': isFolder ? buildStructure(syncrequest('GET', 'https://' + _url.hostname + '/' + rawItems[i].attribs['data-href']).getBody('utf-8')) : []
            });
        }
    }
    return _items;
}

