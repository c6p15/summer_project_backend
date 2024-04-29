require("dotenv").config();
const jwt = require("jsonwebtoken");

/*
// สร้างไว้ test api
const secret = 'MySecret'
*/

const Authentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  let authToken = "";
  if (authHeader) {
    authToken = authHeader.split(" ")[1];
  }
  console.log(authToken);

  try {
    const admin = jwt.verify(authToken, process.env.SECRET);

    console.log("admin", admin.AID);
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = Authentication;
