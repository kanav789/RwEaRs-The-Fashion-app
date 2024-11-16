const jwt = require("jsonwebtoken");

const IsLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).redirect("/login");
    }
    const decoded = jwt.verify(token, "shiv");
    if (!decoded) {
      return res.status(401).redirect("/login");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
module.exports = IsLoggedIn;
