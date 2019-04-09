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
    const { user, story} = req.body;
    let validObject = mongoose.Types.ObjectId;
    //this ensures user id and story id passed are both valid objectId types
    if (!validObject.isValid(user)|| !validObject.isValid(story)) {
        sendJSONResponse(res, 200, Error({ status: 422 }), req.method, 'Invalid user or story id');
    }else{ 
    //check if the story has been bookmarked by the user
    Bookmark.findOne({ user: user, story:story }).then(bookmark => {
        if(bookmark){
            return sendJSONResponse(res, 200, {}, req.method, 'Already Bookmarked');
            //if it hasnt, create a new bookmark
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
}

module.exports.delBookmark = async (req, res) => {
     let validObject = mongoose.Types.ObjectId;
     //this ensures user id and story id passed are both valid objectId types
    if (!validObject.isValid(req.params.b_id) || !validObject.isValid(req.params.u_id)) {
        sendJSONResponse(res, 200, Error({ status: 422 }), req.method, 'Invalid bookmark or user Id');
    }else{
        //try to find the book with the supplied ids before deleting
        Bookmark.findOne({_id:req.params.b_id, user:req.params.u_id}).then(bookmark => {
            //if bookmark not found, then exit with error message
            if(!bookmark){
                sendJSONResponse(res, 200, {}, req.method, 'bookmark doesn\'t exist');
                //else attempt to delete the bookmark
            }else{
                Bookmark.deleteOne({_id:req.params.b_id, user:req.params.u_id},
                function(err, bookmark){
                    if(!err){
                        sendJSONResponse(res, 200, {}, req.method, 'bookmark deleted successfully');
                    }else{
                        sendJSONResponse(res, 200, {bookmark}, req.method, 'Bookmark doesnt exist!');
                    }
                });
            }
        });

    }
}
