var express = require("express");
var app = express();
const fakeUa = require('fake-useragent');

var cache = require("memory-cache"),
    cacheDuration = 300;


const animeData = require("./animeData");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Route",

    );
    next();
});

app.get("/", (_request, _response) => {
    _response.statusCode = 200;
    _response.send("This is DarthAnime!");
});

app.get("/anime", async(_request, _response) => {
    var route = _request.headers["route"];
    if (route === undefined) {
        _response.sendStatus(400);
        return false;
    }

    try {
        var response;
        const userAgent =
            _request.headers["user-agent"] || "DarthAnime (I'm not stealing)";

        let key = "__DarthAnime__" + route;
        let cacheResponse = cache.get(key);
        if (cacheResponse) {
            response = cacheResponse;
            console.log("cache is working");
        } else {
            response = await animeData(route, fakeUa());
            cache.put(key, response, cacheDuration * 10000);
            console.log("this will be cached");
        }

        _response.send(response);
    } catch (error) {
        console.log(error);
        _response.statusCode = 500;
        _response.send(error);
    }
});
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log("This is DarthAnime! \nListening on port" + port);
});
exports = module.exports = app;