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
      // User.findById(decoded.id,
      // { password: 0 }, // projection
      // function (err, user) {
      //   if (err) return res.status(500).send("There was a problem finding the user.");
      //   if (!user) return res.status(404).send("No user found.");

      //   // res.status(200).send(user); Comment this out!
      //   next(user); // add this line
      // });
    }); 
  });
