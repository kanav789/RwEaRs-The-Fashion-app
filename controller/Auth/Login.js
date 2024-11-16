const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel.js");

const Login = async (req, res) => {
  let { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.send("All Fields Are Required");
    }
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.send("You don't have an account please register");
    }
    if (user.password != password) {
      return res.send("Your Password Is Incorrect");
    }
    let token = jwt.sign({ email: email, userid: user._id }, "shiv");
    res.cookie("token", token);

    res.redirect("/");
  } catch (error) {
    return res.status(500).send("Invalid Server Error");
  }
};

module.exports = Login;
