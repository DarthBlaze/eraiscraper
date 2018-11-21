const syncrequest = require('sync-request');
var $ = require('cheerio');
const URL = require('url');

animeData = (_url,_userAgent)=>{
    var body = syncrequest('GET',_url,  {
        headers: {
          'user-agent': _userAgent,
        },
      }).getBody('utf-8');
    return buildStructure(body,_url);
}

buildStructure = (html, url) => {
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
                'child': isFolder ? 'https://' + _url.hostname + '/' + rawItems[i].attribs['data-href'] : ''
            });
        }
    }
    return _items;
}

exports = module.exports = animeData;