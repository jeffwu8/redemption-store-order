const db = require("./db");

exports.readAllOrders = () =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM redemption_store.order", function(error, results) {
      if (error) reject(error);
      resolve(results);
    });
  });

exports.readOrderById = id =>
  new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM redemption_store.order WHERE id = ?",
      [id],
      function(error, results) {
        if (error || results.length == 0) {
          reject(error);
        }
        resolve(results);
      }
    );
  });

exports.createOrders = orders =>
  new Promise((resolve, reject) => {
    let values = [];
    for (const order of orders) {
      values.push([
        order.product_id,
        order.email,
        order.coupon_code,
        order.quantity,
        order.in_store,
        order.date,
        order.ship_date,
        order.status,
        order.deleted
      ]);
    }
    db.beginTransaction(function(error) {
      if (error) reject(error);

      db.query(
        "INSERT INTO redemption_store.order (product_id, email, \
          coupon_code, quantity, in_store, date, ship_date, status, \
          deleted) VALUES ?",
        [values],
        function(error, results) {
          if (error) {
            db.rollback(function() {
              reject(error);
            });
          }
          db.commit(function(err) {
            if (err) {
              return db.rollback(function() {
                reject(error);
              });
            }
            resolve(results);
          });
        }
      );
    });
  });

exports.updateOrder = (id, order) =>
  new Promise((resolve, reject) =>
    db.beginTransaction(function(error) {
      if (error) reject(error);

      db.query(
        "UPDATE redemption_store.order SET order.product_id = ?, \
        order.email = ?, order.coupon_code = ?, order.quantity = ?, order.in_store = ?, \
        order.date = ?, order.ship_date = ?, order.status = ?, order.deleted = ? where order.id = ?",
        [
          order.product_id,
          order.email,
          order.coupon_code,
          order.quantity,
          order.in_store,
          order.date,
          order.ship_date,
          order.status,
          order.deleted,
          id
        ],
        function(error, results) {
          if (error || results.affectedRows == 0) {
            db.rollback(function() {
              reject(error);
            });
          }
          db.commit(function(err) {
            if (err) {
              return db.rollback(function() {
                reject(error);
              });
            }
            resolve(results);
          });
        }
      );
    })
  );

exports.deleteOrder = id =>
  new Promise((resolve, reject) =>
    db.beginTransaction(function(error) {
      if (error) reject(error);

      db.query(
        "UPDATE redemption_store.order SET order.deleted = true where order.id = ?",
        [id],
        function(error, results) {
          if (error || results.affectedRows == 0) {
            db.rollback(function() {
              reject(error);
            });
          }
          db.commit(function(error) {
            if (error) {
              return db.rollback(function() {
                reject(error);
              });
            }
            resolve(results);
          });
        }
      );
    })
  );
