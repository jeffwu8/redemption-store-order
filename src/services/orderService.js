const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

exports.authorize = request =>
  new Promise((resolve, reject) => {
    dotenv.config();

    console.log("Starting Authorization");
    let token = request.headers["x-access-token"] || request.headers['authorization'];

    try {
      if (!token) {
        throw "Invalid Token";
      }
    } catch (error) {
      return reject(error);
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        console.log("Invalid Token");
        return reject(err);
      }
      return resolve(decoded);
    }); 
  });
