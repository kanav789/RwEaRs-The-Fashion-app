const postModel = require("../../models/postModel.js");

const Products = async (req, res) => {
  try {
    let post = await postModel.find().exec();
    if (post) {
      res.render("Admin", { post });
    } else {
      console.log(error);
    }
  } catch (error) {
    console.error("Error Showing product:", error);
    return res.status(500).send("Internal Server Error at Product Showing");
  }
};

module.exports = Products;
