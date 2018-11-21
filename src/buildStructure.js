const syncrequest = require('sync-request');
const $ = require('cheerio');
const URL = require('url');
const config = require('./config/config');

buildStructure = (html) => {
    const rawItems = $('#directory-listing > li', html);
    const itemsAmount = rawItems.length;
    const url = URL.parse(config.url);
    const items = [];

    for (let i = 0; i < itemsAmount; i++) {

        if (rawItems[i].attribs['data-name'].trim() != '..') {

            var isFolder = $('a > div > span.file-name > i', rawItems[i])[0].attribs.class.indexOf('fa-folder') > -1;

            items.push({
                'name': rawItems[i].attribs['data-name'],
                'href': rawItems[i].attribs['data-href'],
                'size': $('a > div > span.file-size', rawItems[i]).text().trim(),
                'type': isFolder ? 'folder' : 'video',
                'childs': isFolder ? buildStructure(syncrequest('GET', 'https://' + url.hostname + '/' + rawItems[i].attribs['data-href']).getBody('utf-8')) : []
            });

        }

    }

    return items;
}

module.exports = buildStructure;