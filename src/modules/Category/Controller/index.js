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
  const findCat = Category.findById(catId);

  //If category exists
  if(findCat){
      if(name){
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
            "Category Updated Succesfully!"
          );
      }
  } else{
      return sendJSONResponse(
        res,
        404,
        null,
        req.method,
        "Category Does Not Exist!"
      );
  }
};
