const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authorize = request =>
  new Promise((resolve, reject) => {
    
    let token = request.headers["x-access-token"] || request.headers['authorization'];

    try {
      if (!token) {
        throw "No Token Provided";
      }
    } catch (error) {
      return reject(error);
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    }); 
  });
