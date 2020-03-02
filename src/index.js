const bodyParser = require("body-parser");
const express = require("express");
const app = express();
require('dotenv').config();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access-Token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use(bodyParser.json());
app.use(require("./controllers/orderController"));
app.listen(process.env.PORT);

console.log("Server running in port: " + process.env.PORT);
