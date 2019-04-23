const mongoose = require('mongoose');
const { sendJSONResponse, decodeToken } = require('../../../helpers');

const Story = mongoose.model('Story');
const Category = mongoose.model('Category');
const User = mongoose.model('User');

/**
   * View All Stories
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.viewStories = async (req, res) => {
  const stories = await Story.find({}).populate('cat_id comments.user', 'name');

  if (stories) { sendJSONResponse(res, 200, { stories }, req.method, 'Stories Fetched'); } else { return sendJSONResponse(res, 500, null, req.method, 'Stories Could Not Be Fetched'); }
};

/**
   * View All Stories By Categories
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */ 
module.exports.viewStoriesByCategory = async (req, res) => {
  const { catId } = req.params;

  if (!catId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Category ID');
  }

  const findCat = await Category.findOne({ _id: catId });

  // Check if category exists
  if (findCat) {
    const stories = findCat.stories;

    const storyArray = [];
    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const st = await Story.findOne(story).populate('cat_id comments.user', 'name');
      if(st != null){
        storyArray.push(st);
      }
     
    }

    if (stories.length > 0) { return sendJSONResponse(res, 200, { storyArray }, req.method, 'Stories Grouped By Category Fetched'); }
    return sendJSONResponse(res, 404, null, req.method, 'Stories Could Not Be Fetched');
  }

  return sendJSONResponse(res, 400, null, req.method, 'Invalid category');
};

/**
   * View Single Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.viewSingleStory = async (req, res) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Story ID');
  }

  const story = await Story.findById(id).populate('cat_id comments.user', 'name');
  if (!story) {
    return sendJSONResponse(res, 404, null, req.method, 'Story Is Not Available!');
  }

  // console.log(story.designation)
  // for (let i = 0; i < story.length; i++) {
  //   const st = await User.findOne(story.designation);
  //   console.log(story);
  // }
  // if(user) const author = user.name;
  return sendJSONResponse(res, 200, { story }, req.method, 'Story Fetched');
};

/**
   * Create Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.create = async (req, res) => {
  const { title, story, category } = req.body;
  if (!title) {
    return sendJSONResponse(res, 400, null, req.method, 'Title cannot be empty or undefined');
  }

  if (!story) {
    return sendJSONResponse(res, 400, null, req.method, 'Story cannot be empty or undefined');
  }

  if (!category) {
    return sendJSONResponse(res, 400, null, req.method, 'Category cannot be empty or undefined');
  }

  // check if category is a available one
  const catResult = await Category.findOne({ name: category });
  if (!catResult) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid category');
  }

  // If category exists
  const storyModel = new Story();
  storyModel.title = title;
  storyModel.story = story;
  storyModel.cat_id = catResult._id;
  const author = decodeToken(req, res);

  storyModel.designation = author._id;
  storyModel.author = author.name;
  storyModel.likes = 0;
  storyModel.dislikes = 0;

  // if user adds an image
  if (req.file) {

    try {
      const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;

    storyModel.imageId = image.id;
    storyModel.image = image.url;
    } catch (error) {
      return sendJSONResponse(res, 408, null, req.method, 'Bad Network');
    }
  } else {
    storyModel.image = 'https://res.cloudinary.com/ephaig/image/upload/v1555067803/top-best-storybook-apps-for-kids-i-love-you-all-the-time-3.jpg';
  }
  // save story to db
  await storyModel.save();
  // store story id in category
  catResult.stories.push(storyModel._id);
  catResult.save();
  sendJSONResponse(res, 201, { storyModel }, req.method, 'Created New Story!');
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

  if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Story ID');
  }
  let catResult = {};
  // check if category is a available one
  if (category) {
    catResult = await Category.findOne({ name: category });
    
    // check if category still exists or has been changed
    if (!catResult) {
      return sendJSONResponse(res, 400, null, req.method, 'Category Cannot Be Found');
    }

    
  }


  // If category exists
  const findStory = await Story.findById(storyId);

  // check if user is admin
  const user = await decodeToken(req, res);

  if (user._id !== findStory.designation && user.admin !== true) {
    return sendJSONResponse(res, 401, null, req.method, 'Unauthorized User');
  }

  // if story exists
  if (findStory) {
    const storyModel = new Story();
    storyModel.title = title;
    storyModel.story = story;
    storyModel.cat_id = catResult._id;
    storyModel.designation = user._id;

    // if user adds an image
    if (req.file) {

      try {
        const image = {};
      image.url = req.file.url;
      image.id = req.file.public_id;

      storyModel.imageId = image.id;
      storyModel.image = image.url;
      } catch (error) {
        return sendJSONResponse(res, 408, null, req.method, 'Bad Network');
      }
    }
    await storyModel.save();
    sendJSONResponse(res, 201, { storyModel }, req.method, 'Story Updated!');
  } else {
    return sendJSONResponse(res, 400, null, req.method, 'Story Is Not Available');
  }
};

/**
   * Like  Story
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {json} res.json
   */
module.exports.likeStory = async (req, res) => {
  const { storyId } = req.params;
  //const user = decodeToken(req, res)._id;

  if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Story ID');
  }

  // Checking whether the story to be liked exist in the DB
  const story = await Story.findById(storyId);

  if (!story) {
    return sendJSONResponse(res, 404, null, req.method, 'invalid story id');
  }

  // Checking wheter the post have been liked or not
  // if (story.likes.filter(like => like.user.toString() === user).length > 0) {
  //   return sendJSONResponse(res, 400, null, req.method, 'You have like this story already');
  // }

  // like story
  // const test = await Story.update(
  //   { _id: storyId },
  //   { $push: { likes: { user } } },
  // );
  let num = story.likes;
  if(isNaN(num)){
    num = 1;
  }else{
    num += 1;
  }

  story.likes = num;
  await story.save();

  return sendJSONResponse(res, 200, story, req.method, 'Story Liked');
};

module.exports.disLikeStory = async (req, res) => {
  const { storyId } = req.params;
  //const user = decodeToken(req, res)._id;

  if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Story ID');
  }

  // Checking whether the story to be liked exist in the DB
  const story = await Story.findById(storyId);

  if (!story) {
    return sendJSONResponse(res, 404, null, req.method, 'invalid story id');
  }

  // Checking wheter the post have been liked or not
  // if (story.likes.filter(like => like.user.toString() === user).length === 0) {
  //   return sendJSONResponse(res, 400, null, req.method, 'You have not like this story yet');
  // }

  // like story
  // await Story.update(
  //   { _id: storyId },
  //   { $pull: { likes: { user } } },
  // );
  let num = story.dislikes;
  if(isNaN(num)){
    num = 1;
  }else{
    num += 1;
  }

  story.dislikes = num;
  await story.save();
  return sendJSONResponse(res, 200,story, req.method, 'Story Disliked');
};

module.exports.deleteStory = async (req, res) => {
  const { storyId } = req.params;

  if (!storyId.match(/^[0-9a-fA-F]{24}$/)) {
    return sendJSONResponse(res, 400, null, req.method, 'Invalid Story ID');
  }

  // Checking whether the story to be deleted exist in the DB
  const story = await Story.findById(storyId);

  if (!story) {
    return sendJSONResponse(res, 404, null, req.method, 'story does not exist');
  }

  // check if user is admin or logged in
  const user = await decodeToken(req, res);

  if (user._id !== story.designation && user.admin !== true) {
    return sendJSONResponse(res, 401, null, req.method, 'Unauthorized User');
  }

  //delete story from category
  const categoryArray = story.cat_id;

  for (let i = 0; i < categoryArray.length; i++) {
    const category = categoryArray[i];
    Category.findById(category, (err, findCategory) => {
      if (err) {
        return sendJSONResponse(res, 404, null, req.method, 'Category Does Not Exists');
      }
      const arr = findCategory.stories;
      let index = arr.indexOf(story._id);
      if (index > -1) {
        arr.splice(index, 1);
      }
    })
  }
  //await Category.findOne({_id: story.cat_id})
  // delete story
  await Story.findOneAndRemove({ _id: storyId });

  const except = {
    _v: false
  };
  const reloadStories = await Story.find({}, except);
  console.log(reloadStories);

  return sendJSONResponse(res, 200, { reloadStories }, req.method, 'Story Deleted');
};

module.exports.createComment = async (req, res) => {
  const { comment } = req.body;
  const { storyId } = req.params;
  const token = req.headers.authorization;
  const userId = decodeToken(req, res)._id; 
  const findStory = Story.findOne({ _id: storyId });

  if(!findStory) {
    return sendJSONResponse(res, 400, {}, req.method, 'Story does not exist');
  }

  await Story.update(
    { _id: storyId },
    { $push: { comments: { user: userId, comment } } },
  );

  return sendJSONResponse(res, 201, {}, req.method, 'Comment created successfully');

};

module.exports.deleteComment = async (req, res) => {
  const { storyId, commentId } = req.params;
  const user = decodeToken(req, res); 
  const findStory = Story.findOne({ _id: storyId });


  if (!findStory) {
    return sendJSONResponse(res, 400, {}, req.method, 'Story does not exist');
  }
  const findComment = await Story.findOne({ 'comments._id': commentId });
  
  if (!findComment) {
    return sendJSONResponse(res, 400, {}, req.method, 'Comment does not exist');
  }
  
  const userId = findComment.comments[0].user;
  // console.log(`'${userId}'`, `'${user._id}'`,user.admin);
  
  

  if ( `'${userId}'` === `'${user._id}'` || user.admin === true ) {
   await Story.update(
      { 'comments._id': commentId },
      { $pull: { comments: { user: userId } } },
    );
    return sendJSONResponse(res, 204, {}, req.method, 'Comment deleted');
  }

  if (findComment.user !== user._id) {
    return sendJSONResponse(res, 400, {}, req.method, 'You are not allowed to delete this comment');
  }

};
