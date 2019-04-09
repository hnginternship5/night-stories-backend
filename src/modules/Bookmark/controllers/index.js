const mongoose = require('mongoose');
const { sendJSONResponse } = require('../../../helpers');

const Bookmark = mongoose.model('Bookmark');

module.exports.getBookmark = async (req, res) => {
    //check if the passed user id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id )) {
        sendJSONResponse(res, 200, Error({ status: 422 }), req.method, 'Invalid User Id');
    }else{
        //if it is, return the user's bookmark and populate it with stories
        const bookmark = await Bookmark.find({ user: req.params.id }).populate('story');
        sendJSONResponse(res, 200, { bookmark}, req.method, 'Bookmark fetched');
    }
};

module.exports.addBookmark = async (req, res) => {
    //this assumes the passed user and story params are valid ids of each field
    const { user, story} = req.body;
    //check if the story has been bookmarked by the user
    Bookmark.findOne({ user: user, story:story }).then(bookmark => {
        if(bookmark){
            return sendJSONResponse(res, 409, {}, req.method, 'Already Bookmarked');
            //if it hasnt create a new bookmark
        }else{
            var newBookmark = new Bookmark();
            newBookmark.user = user;
            newBookmark.story = story;
            newBookmark.save(function (err, newBookmark){
                if(err){ 
                    sendJSONResponse(res, 200, {}, req.method, 'Error creating new bookmark');
                }
                    sendJSONResponse(res, 200, { newBookmark }, req.method, 'Bookmark Created');
            });
        }
    });
        
}
