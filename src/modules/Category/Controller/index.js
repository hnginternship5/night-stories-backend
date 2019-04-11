const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const Category = mongoose.model('Category');
const Story = mongoose.model('Story');

/**
   * Create Category
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.create = async (req, res) => {
  let { name } = req.body;
  name = name.toLowerCase();
  // Check if category exists
  const findCat = await Category.findOne({ name });

  // If exists
  if (findCat) {
    return sendJSONResponse(
      res,
      409,
      null,
      req.method,
      'Category Already Exists!',
    );
  }
  const category = new Category();

  category.name = name;
  category.save();
  sendJSONResponse(
    res,
    200,
    {
      category,
    },
    req.method,
    'New Category Created',
  );
};

/**
   * Update category
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.update = async (req, res) => {
  const { name } = req.body;
  const { catId } = req.params;

  // Check if category exists
  Category.findById(catId, (err, category) => {
    if (err) {
      return sendJSONResponse(res, 409, null, req.method, 'Category not Found!');
    }
    if (name) {
      category.name = name;
    }

    category.save();
    sendJSONResponse(
      res,
      200,
      {
        category,
      },
      req.method,
      'Category Updated Succesfully!',
    );
  });
};

/**
   * Get all category
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.getAll = async (req, res) => {
  const category = await Category.find({}, 'name');

  if (category) {
    return sendJSONResponse(
      res,
      200,
      category,
      req.method,
      ' All Categories sent Succesfully!',
    );
  }

  return sendJSONResponse(
    res,
    200,
    {
      category,
    },
    req.method,
    'No category available',
  );
};

module.exports.delete = async (req, res) => {
  const { catId } = req.params;

  // Check if category exists
  const findCat = await Category.findOne({ _id: catId });

  // If exists
  if (!findCat) {
    return sendJSONResponse(
      res,
      409,
      null,
      req.method,
      'Category Does Not Exists!',
    );
  }
  const findStory = await Story.find({ cat_id: catId });

  if (findStory.length > 0) {
    return sendJSONResponse(
      res,
      400,
      {},
      req.method,
      'Cannot Delete Category Because Stories Exists Under It',
    );
  }

  await Category.deleteOne({ _id: catId });
  sendJSONResponse(
    res,
    204,
    {},
    req.method,
    'Category Deleted',
  );
};
