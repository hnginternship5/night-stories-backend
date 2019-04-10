const mongoose = require('mongoose');
const Category = require('../../../models/Category')
const { sendJSONResponse, decodeToken } = require('../../../helpers');

const Story = mongoose.model('Story');

module.exports.viewStories = async (req, res) => {
  const story = await Story.find({});
  sendJSONResponse(res, 200, { story }, req.method, 'Stories Fetched');
};

module.exports.viewSingleStory = async (req, res) => {
  const story = await Story.findById({ _id: req.params.id });
  sendJSONResponse(res, 200, { story }, req.method, 'Story Fetched');
};

module.exports.create = async (req, res) => {
  const { title, description, category } = req.body;
  const { token } = req.headers;
  const decoded = decodeToken(token);

  // check if category is a available one
  const catResult = await Category.findOne({ name: category });
  if (!catResult) {
    return sendJSONResponse(res, 400, {}, req.method, 'Invalid category');
  }

  const story = new Story();
  story.story_title = title;
  story.story_description = description;
  story.cat_id = catResult._id;
  story.designation = decoded._id;
  await story.save();
  sendJSONResponse(res, 201, { }, req.method, 'Created New Story!');
};
