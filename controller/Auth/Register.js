const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel.js");

const Register = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(500).send("This email is already registered");
    }
    let createUser = await userModel.create({
      name,
      email,
      password,
    });
    let token = jwt.sign({ email: email, userid: createUser._id }, "shiv");
    res.cookie("token", token);

    res.redirect("/");
  } catch (error) {
    res.status(400).send("Internal Server Error At The Time Of Registration");
  }
};
module.exports = Register;
