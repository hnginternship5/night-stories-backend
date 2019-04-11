const mongoose = require('mongoose');
const { sendJSONResponse, decodeToken } = require('../../../helpers');

const Story = mongoose.model('Story');
const Category = mongoose.model('Category');
const User = mongoose.model('User');

const cloudinary = require('cloudinary').v2;
// cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
   * View All Stories
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.viewStories = async (req, res) => {
  const stories = await Story.find({}).populate('cat_id','name');

  if(stories)
    sendJSONResponse(res, 200, { stories }, req.method, 'Stories Fetched');
  else
  return sendJSONResponse(res, 500, null, req.method, 'Stories Could Not Be Fetched');  
};

/**
   * View All Stories By Categories
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
  module.exports.viewStoriesByCategory = async (req, res) => {
    const { catId } = req.params;

    const findCat = await Category.findOne({name:catId});

    //Check if category exists
    if(findCat){
      const stories = findCat.stories;

      const storyArray = [];
      for (let i = 0; i < stories.length; i++) {
        const story = stories[i];
        const st = await Story.findOne(story);
        storyArray.push(st);
      }
      
      if(stories)
        return sendJSONResponse(res, 200, { storyArray }, req.method, `Stories Grouped By Category Fetched`);
      else
        return sendJSONResponse(res, 500, null, req.method, 'Stories Could Not Be Fetched');  
    }
    else{
      return sendJSONResponse(res, 400, null, req.method, 'Invalid category');
    }
    
  };

/**
   * View Single Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.viewSingleStory = async (req, res) => {
  const { id } = req.params;

  Story.findById(id, (err, story) => {
    if (err) {
      return sendJSONResponse(res, 409, null, req.method, "Story Is Not Available!");
    }

    return sendJSONResponse(res, 200, { story }, req.method, 'Story Fetched');
  });
};

/**
   * Create Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.create = async (req, res) => {
  const { title, story, category } = req.body;

  // check if category is a available one
  const catResult = await Category.findOne({ name: category });
  if (!catResult) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid category');
  }

  //If category exists
  const storyModel = new Story();
  storyModel.title = title;
  storyModel.story = story;
  storyModel.cat_id = catResult._id;
  const author = decodeToken(req, res);
  storyModel.designation = author._id;

  //if user adds an image
  if (req.file) {
    try {
      const result = cloudinary.uploader.upload(req.file.path);
      const imageId = result.public_id;
      const image = result.secure_url;
      storyModel.imageId = imageId;
      storyModel.image = image;

    } catch (errs) {
      return sendJSONResponse(res, 400, null, req.method, "Error Adding Image");
    }
  }
  //save story to db
  await storyModel.save();
  //store story id in category
  catResult.stories.push(storyModel._id);
  catResult.save();
  sendJSONResponse(res, 201, {storyModel}, req.method, 'Created New Story!');
};

/**
   * Update Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
  module.exports.update = async (req, res) => {
    const { title, story, category } = req.body;
    const { storyId } = req.params;
  
    // check if category is a available one
    if(category){
      const catResult = await Category.findOne({ name: category });

      //check if category still exists or has been changed
      if (!catResult) {
        return sendJSONResponse(res, 400, null, req.method, 'Category Cannot Be Found');
      }
    }
      
  
    //If category exists
    const findStory = await Story.findById(storyId);

    //check if user is admin
    const user = await decodeToken(req, res);
    console.log(user)
    const isAdmin = await User.findById(user._id);
    console.log(isAdmin)
    if(req.id !== findStory.designation && isAdmin.is_admin !== true){
      return sendJSONResponse(res, 401, null, req.method, "Unauthorized User");
    }

    //if story exists
    if(findStory){
      const storyModel = new Story();
      storyModel.title = title;
      storyModel.story = story;
      storyModel.cat_id = catResult._id;
      storyModel.designation = req.id;
    
      //if user adds an image
      if (req.file) {
        try {
          const result = cloudinary.uploader.upload(req.file.path);
          const imageId = result.public_id;
          const image = result.secure_url;
          storyModel.imageId = imageId;
          storyModel.image = image;
    
        } catch (errs) {
          return sendJSONResponse(res, 400, null, req.method, "Error Adding Image");
        }
      }
      await storyModel.save();
      sendJSONResponse(res, 201, {storyModel}, req.method, 'Story Updated!');
    }else{
      return sendJSONResponse(res, 400, null, req.method, 'Story Is Not Available'); 
    }
  };
