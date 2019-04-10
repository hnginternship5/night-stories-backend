const mongoose = require('mongoose');
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
  const { title, description } = req.body;
  const { token } = req.headers;
  const decoded = decodeToken(token);
  const story = new Story();
  story.story_title = title;
  story.story_description = description;
  story.designation = decoded._id;
  await story.save();
  sendJSONResponse(res, 201, { }, req.method, 'Created New Story!');
};
