const mongoose = require("mongoose");
const { sendJSONResponse } = require("../../../helpers");

const Category = mongoose.model("Category");

/**
   * Create Category
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.create = async (req, res) => {
  const { name } = req.body;

  //Check if category exists
  const findCat = await Category.findOne({ name });

  //If exists
  if(findCat){
    return sendJSONResponse(
        res,
        409,
        null,
        req.method,
        "Category Already Exists!"
    )
  } else {
      const category = new Category();

      category.name = name;
      category.save();
      sendJSONResponse(
          res,
          200,
          {
              category
          },
          req.method,
          "New Category Created"
      )
  }
};

/**
   * Update category
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.update = async (req, res) => {
  const { name } = req.body;
  const { catId} = req.params;

  //Check if category exists
  Category.findById(catId, (err, category) => {
    if (err) {
      return sendJSONResponse(res, 409, null, req.method, "Category not Found!");
    }
    if (name) {
      category.name = name;
    }

    category.save();
    sendJSONResponse(
      res,
      200,
      { 
        category
       },
      req.method,
      "Category Updated Succesfully!"
    );
  });
};

