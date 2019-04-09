const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const Story = mongoose.model('Story');

module.exports.viewStories = async (req, res) => {
  const story = await Story.find({});
  sendJSONResponse(res, 200, { story }, req.method, 'Stories Fetched');
};

module.exports.viewSingleStory = async (req, res) => {
  const story = await Story.findById({ _id: req.params.id });
  sendJSONResponse(res, 200, { story }, req.method, 'Story Fetched');
};
