var express = require("express");
var app = express();
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

app.get("/anime", (_request, _response) => {
  var route = _request.headers["route"];
  if (route === undefined) {
    _response.sendStatus(400);
    return;
  }

  console.log(route);

  try {
    const userAgent =
      _request.headers["user-agent"] || "DarthAnime (I'm not stealing)";
var x = animeData(route, userAgent);

    _response.send(x);
  } catch (error) {
    console.log(error);
    _response.statusCode = 500;
    _response.send(error);
  }
});

app.listen("80");
console.log("This is DarthAnime! \n Listening on port 80");
exports = module.exports = app;
