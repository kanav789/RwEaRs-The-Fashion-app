const postModel = require("../../models/postModel.js");

const ProductCreate = async (req, res) => {
  try {
    const { price, size, discount, image, title, type } = req.body;

    // Validate request body
    if (!price || !size || !discount || !image || !title || !type) {
      return res.status(400).send("All Fields Are Required");
    }

    // Create the product
    const post = await postModel.create({
      price,
      size,
      discount,
      image,
      title,
      type,
    });

    // Redirect or respond
    res.redirect("/iamtheAdmin");
    // or return JSON if frontend handles redirection
    // res.status(201).json({ message: "Product created successfully", post });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send("Internal Server Error at Product Creation");
  }
};

module.exports = ProductCreate;
