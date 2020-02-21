const routes = require("express").Router();
const accepts = require("accepts");
const js2xmlparser = require("js2xmlparser");

const orderDao = require("../dao/orderDao");
const orderService = require("../services/orderService");

routes.get("/orders", function(request, response) {
  const accept = accepts(request);

  orderService
    .authorize(request)
    .then(() => {
      orderDao
        .readAllOrders()
        .then(results => {
          switch (accept.type(["json", "xml"])) {
            case "json":
              response.setHeader("Content-Type", "application/json");
              response.status(200);
              response.send(results);
              break;
            case "xml":
              response.setHeader("Content-Type", "application/xml");
              response.status(200);
              response.send(js2xmlparser.parse("orders", results));
              break;
            default:
              response.status(406);
              response.send();
              break;
          }
        })
        .catch(error => {
          response.status(404);
          response.send();
        });
    })
    .catch(error => {
      response.status(401);
      response.send();
    });
});

routes.get("/orders/:id", function(request, response) {
  const accept = accepts(request);

  orderDao
    .readOrderById(request.params.id)
    .then(results => {
      switch (accept.type(["json", "xml"])) {
        case "json":
          response.setHeader("Content-Type", "application/json");
          response.status(200);
          response.send(results);
          break;
        case "xml":
          response.setHeader("Content-Type", "application/xml");
          response.status(200);
          response.send(js2xmlparser.parse("order", results));
          break;
        default:
          response.status(406);
          response.send();
          break;
      }
    })
    .catch(error => {
      response.status(404);
      response.send();
    });
});

routes.post("/orders", function(request, response) {
  var orders = request.body;
  orderDao
    .createOrders(orders)
    .then(results => {
      response.status(201);
      response.send();
    })
    .catch(error => {
      response.status(400);
      response.send();
    });
});

routes.put("/orders/:id", function(request, response) {
  var order = request.body;
  orderDao
    .updateOrder(request.params.id, order)
    .then(results => {
      response.status(204);
      response.send();
    })
    .catch(error => {
      response.status(400);
      response.send();
    });
});

routes.delete("/orders/:id", function(request, response) {
  orderDao
    .deleteOrder(request.params.id)
    .then(result => {
      response.status(204);
      response.send();
    })
    .catch(error => {
      response.status(400);
      response.send();
    });
});

module.exports = routes;
