const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/Rwears")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});
module.exports = mongoose.model("user", userSchema);
