require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const app = express();
const path = require("path");
const jwt = require("jsonwebtoken");




const cookieParser = require("cookie-parser");
const userModel = require("./models/userModel");
const postModel = require("./models/postModel");
const { error } = require("console");
const Register = require("./controller/Auth/Register");
const Login = require("./controller/Auth/Login");
const IsLoggedIn = require("./middleware/IsLoggedIn");
const ProductCreate = require("./controller/Admin/ProductCreate.js");
const Products = require("./controller/Admin/Products.js");
app.use(cookieParser());

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// simple routes
app.get("/", IsLoggedIn, (req, res) => {
  res.render("home");
});

// men
app.get("/mens", IsLoggedIn, async (req, res) => {
  try {
    let mens = await postModel.find({ type: "men" }).exec();
    res.render("mens", { mens });
  } catch (error) {
    res.send(error).status(404);
  }
});
// teenguy
app.get("/teenguy", IsLoggedIn, async (req, res) => {
  try {
    let teenguy = await postModel.find({ type: "teenguy" }).exec();

    res.render("teenguy", { teenguy });
  } catch (error) {
    res.send(error).status(404);
  }
});
// women
app.get("/women", async (req, res) => {
  try {
    let women = await postModel.find({ type: "women" }).exec();

    res.render("women", { women });
  } catch (error) {
    res.send(error).status(404);
  }
});

// register and loogin
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/create", Register);

app.get("/logout", IsLoggedIn, async (req, res) => {
  res.cookie("token", "").redirect("/login");
});

app.get("/login", async (req, res) => {
  res.render("login");
});
app.post("/login", Login);

// admin section
app.get("/post", IsLoggedIn, (req, res) => {
  res.render("post");
});

app.post("/post", IsLoggedIn, ProductCreate);

app.get("/iamtheadmin", IsLoggedIn, Products);

app.get("/overCard/:id", IsLoggedIn, async (req, res) => {
  try {
    let postId = req.params.id;
    let post = await postModel.findById(postId);
    res.render("overCard", { post });
  } catch (error) {
    res.send("Failed to get overview").status(404);
  }
});

app.post("/overCard/:id", IsLoggedIn, async (req, res) => {
  try {
    let postId = req.params.id;
    let data = jwt.verify(req.cookies.token, "shiv");
    let email = data.email;
    let user = await userModel.findOne({ email });
    user.cart.push(postId);

    user.save();

    res.redirect(`/overCard/${postId}`);
  } catch (error) {
    throw error;
  }
});

app.get("/cart", IsLoggedIn, async (req, res) => {
  try {
    const token = req.cookies.token;
    const data = jwt.verify(token, "shiv");
    const email = data.email;
    const user = await userModel.findOne({ email });

    // Assuming `user.cart` is an array of product IDs
    const cart = user.cart;

    const rawcart = await postModel.find({ _id: { $in: cart } }).exec();

    res.render("cart", { rawcart });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/cart/:id", IsLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;
    const data = jwt.verify(req.cookies.token, "shiv");
    const email = data.email;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const index = user.cart.indexOf(productId);
    if (index > -1) {
      user.cart.splice(index, 1);
      await user.save();
      res.status(200);
      res.redirect("/cart");
    } else {
      res.status(404).send("Item not found in cart");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



// demo
app.get("/header", (req, res) => {
  res.render("header");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
