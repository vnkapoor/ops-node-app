const jwt = require("jsonwebtoken");
const { User } = require("./../models");

module.exports = async (req, res, next) => {
    //Get the bearer token from the headers
    let token = req.headers["authorization"];
    console.log(token);
    let msg = "Unauthorized";
    //Decode the token
    if (token) {
      token = token.replace(/^Bearer\s+/, "");
      try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        //Match the token email id with the actual db email-id
        const response = await User.findOne({ attributes: ["email"], where: { email: decodedToken.sub } });
        if (response.email === decodedToken.sub) {
          next();
        }
      } catch(err) {
        return res.status(401).json({ error: msg });
      }
    } else {
      return res.status(401).json({ error: msg });
    }
};
