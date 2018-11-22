var express = require("express");
var app = express();
const animeData = require("./animeData");

app.get("/", (_request, _response) => {
  _response.statusCode = 200;
  _response.send("This is DarthAnime!");
});

app.get("/anime", (_request, _response) => {
  var route = _request.headers["route"];
  if (route === undefined) {
    _response.sendStatus(400);
    return;
  }

  try {
    const userAgent = _request.headers["user-agent"]||"DarthAnime (I'm not stealing)";

    _response.send(animeData(route, userAgent));
  } catch (error) {
    console.log(error);
    _response.statusCode = 500;
    _response.send(error);
  }
});

app.listen("80");
console.log("This is DarthAnime! \n Listening on port 80");
exports = module.exports = app;