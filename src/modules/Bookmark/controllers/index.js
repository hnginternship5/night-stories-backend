/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const { sendJSONResponse, decodeToken } = require('../../../helpers');

const Bookmark = mongoose.model('Bookmark');
const User = mongoose.model('User');

module.exports.getAllFavorite = async (req, res) => {
  //user id
  const user = await decodeToken(req, res);

  // if it is, return the user's bookmark and populate it with stories
  const bookmark = await Bookmark.find({ user: user._id }).populate('story');

  sendJSONResponse(res, 200, { bookmark }, req.method, 'Bookmark fetched');
  
};

module.exports.addAndRemoveFavorite = async (req, res) => {
  const { storyId } = req.params;
  const validObject = mongoose.Types.ObjectId;
  // this ensures user id and story id passed are both valid objectId types
  if (!validObject.isValid(storyId)) {
    return sendJSONResponse(res, 404, null , req.method, 'Invalid story id');
  }

  const user = await decodeToken(req, res);
  const favAction = await Bookmark.findOne({ user:user._id, story:storyId });
  

  if(favAction === null){
    const newBookmark = new Bookmark();
    newBookmark.user = user._id;
    newBookmark.story = storyId;

    newBookmark.save();

    //save to user schema
    const addToUser = await User.findById(user._id);
    addToUser.bookmarks.push(newBookmark.story);
    addToUser.save()
    return sendJSONResponse(res, 200, { newBookmark }, req.method, 'Story Favorited');
  }

  //if story has been favorited, remove
  await Bookmark.findOneAndDelete({ user:user._id, story:storyId });
  const addToUser = await User.findById(user._id);
  const arr = addToUser.bookmarks;
  
  for (let i = 0; i < arr.length; i++) {
    const fav = arr[i];
    let j = arr.indexOf(fav);
    if (JSON.stringify(fav._id) === JSON.stringify(favAction.story)) {
      arr.splice(j, 1);
    }
  }

  //save to user schema
  addToUser.save();
  return sendJSONResponse(res, 200, { favAction }, req.method, 'Favorite Has Been Removed');
};

