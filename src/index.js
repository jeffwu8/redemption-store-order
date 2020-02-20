var bodyParser = require("body-parser");
var express = require("express");
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// parse application/json
app.use(bodyParser.json());
app.use(require("./controllers/orderController"));
app.listen(8090);
console.log("Server running in port: 8090 ...");
