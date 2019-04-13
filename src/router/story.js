const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../models/User');

// Story model
const Story = require('../models/Story');


// @route   POST /create
// @desc    Create post
// @Note    This route was created to create samples of story so as to test the
//          likeand Unlike feature
// @access  Private
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newStory = new Story({
      story_title: req.body.title,
      story_description: req.body.description,
      user: req.user.id,
      designation: req.body.designation,
    });

    // Story Been saved to the Story DB
    newStory.save().then(story => res.json(story));
  },
);
// @route   POST /story/liken/:id
// @desc    Like post
// @Note    A single powerful route that handle both Like and Unlike  of post
// @access  Private
router.post(
  '/liken/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // finding the logged  in user
    User.findById(req.user.id).then((user) => {
      // Checking whether the story to be liked exist in the DB
      Story.findById(req.params.id)
        .then((story) => {
          // Checking wheter the post have been liked or not
          // by checking both the User DB(liked_post) and Story DB(likes)
          if (
            story.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0 && user.liked_story.filter(like => like.story.toString() === req.params.id).length > 0
          ) {
            // Else it is liked (I.e it run only when the story have been liked)
            // so it has to be disliked
            // Getting the index the  liked story from the user DB
            const removeIndexStory = story.likes
              .map(item => item.user.toString())
              .indexOf(req.user.id);

              // Getting the index the  user like from the story DB
            const removeIndexUser = user.liked_story
              .map(item => item.story.toString())
              .indexOf(req.params.id);

              // Splice out story from user liked_post array
            user.liked_post.splice(removeIndexUser, 1);

            // Save the User Instance
            user.save().then(user);

            // Splice out user from likes array
            story.likes.splice(removeIndexStory, 1);

            // Save the Story instance
            story.save().then(story => res
              .status(400)
              .json({
                liked: false,
                user,
                story,
              }))
              .catch((err) => {
                res.status(404)
                  .json({ postnotfound: 'No post found' });
              // Error cached above
              });
          } else if (story.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0 && user.liked_story.filter(like => like.story.toString() === req.params.id)
            .length === 0) {
          // else the post havent been liked before
          // So we are going to like it

          // Add story id to te user liked_post array
            user.liked_story.unshift({ story: req.params.id });

            // Save the User instance
            user.save().then();

            // Add User id to the story likes array
            story.likes.unshift({ user: req.user.id });

            // Save the story instance
            story.save().then(story => res.json({
              liked: true,
              user,
              story,
            }))
              .catch((err) => {
                res.status(404).json({ storynotfound: 'No Story found' });
                // Error cached above
              });
          }
        })
        .catch((err) => {
          res.status(404).json({ storynotfound: 'No Story found' });
        // Error cached above
        });
    });
  },
);


// @route   POST /story/liked/:id
// @desc    Like post
// @Note    This route is created to handle the liking of post
// @access  Private
router.post(
  '/liked/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // finding the logged  in user
    User.findById(req.user.id).then((user) => {
      // Checking whether the story to be liked exist in the DB
      Story.findById(req.params.id)
        .then((story) => {
          // Checking wheter the post have been liked or not
          // by checking both the User DB(liked_post) and Story DB(likes)
          if (
            story.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0 && user.liked_story.filter(like => like.story.toString() === req.params.id).length > 0
          ) {
            // if already liked it return a json(400)
            return res
              .status(400)
              .json({
                alreadyliked: 'User already liked this Story',
                liked: true,
              });
          }
          // else the post havent been liked before
          // so is going to be liked
          // Add story id to te user liked_post array
          user.liked_story.unshift({ story: req.params.id });
          // Save the User instance
          user.save().then();

          // Add User id to the story likes array
          story.likes.unshift({ user: req.user.id });
          // Save the story instance
          story.save().then(story => res.json({ story, user, justLiked: 'you just like the Story' }));
        })
        .catch((err) => {
          res.status(404).json({ postnotfound: 'No post found' });
        // Error cached above
        });
    });
  },
);


// @route   POST /story/unliked/:id
// @desc    Unlike post
// @Note This Route is created for unliking  a liked post
// @access  Private
router.post(
  '/unliked/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Filtering the user data out
    User.findById(req.user.id).then((user) => {
      // Finding the said to be unliked post
      Story.findById(req.params.id)
        .then((story) => {
          // Checking to see whether the story have been liked already in both the User
          // and the Story DB
          if (
            story.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0 && user.liked_story.filter(like => like.story.toString() === req.params.id)
              .length === 0
          ) {
            // response showing it does not exist
            return res
              .status(400)
              .json({
                notliked: 'You have not yet liked this post',
                liked: false,
              });
          }
          // Else it is liked
          // so it has to be dislike

          // Getting the index the  liked story from the user DB
          const removeIndexStory = story.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Getting the index the  user like from the story DB
          const removeIndexUser = user.liked_story
            .map(item => item.story.toString())
            .indexOf(req.params.id);

          // Splice out story from user liked_post array
          user.liked_story.splice(removeIndexUser, 1);

          // Save the User Instance
          user.save().then();

          // Splice out user from likes array
          story.likes.splice(removeIndexStory, 1);

          // Save the Story instance
          story.save().then(story => res.json({
            liked: false,
            notLiked: 'you have just dislike this story',
          }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
      // error Cached above
    });
  },
);

// /////////////////////////////////////////

// @route   POST /story/like/:id
// @desc    Like post
// @Note    This is a route for handling likes regarding to story alone
//          it wont be saved on user Db
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // fquerying the user Db
    User.findById(req.user.id).then((user) => {
      // querying the Story db for a single story instance
      Story.findById(req.params.id)
        .then((story) => {
          // checking to see wheter story have been liked
          if (
            story.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            // Story have been liked response to return json
            return res
              .status(400)
              .json({
                alreadyliked: 'User already liked this post',
                liked: true,
              });
          }

          // Add user id to likes array
          story.likes.unshift({ user: req.user.id });
          // Save the User instance
          story.save().then(post => res.json({ post, liked: true, status: 'you just like this story' }));
        })
        .catch((err) => {
          res.status(404).json({ postnotfound: 'No post found' });
        // If any error Cache it
        });
    });
  },
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @Note    This is route only dislike post from stoy DB
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //   // Querying the user Db for a single user instance
    User.findOne({ user: req.user.id }).then((user) => {
    //     // Querying the Story Db for a single story instance
      Story.findById(req.params.id)
        .then((story) => {
          //         //checky whether the liked post exist in the story DB
          if (
            story.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            // it does not exist it return a JSON
            return res
              .status(400)
              .json({
                status: 'You have not yet liked this post',
                liked: false,
              });
          }
          // oh it exist
          // Get remove index
          const removeIndex = story.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          story.likes.splice(removeIndex, 1);

          //         // Save
          story.save().then(post => res
            .json({
              post,
              liked: false,
            }))
            .catch(err => res.status(404).json({ status: 'No post found' }));
        });
    });
  },
);


// @route   POST /story/bookmark/:id
// @desc    Like post
// @Note    This is a route for handling likes regarding to story alone
//          it wont be saved on user Db
// @access  Private
router.post(
  '/bookmark/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // querying the user Db
    User.findById(req.user.id).then((user) => {
      // querying the Story db for a single story instance
      Story.findById(req.params.id)
        .then((story) => {
          // checking to see wheter story have been bookmarked
          if (
            user.bookmarks.filter(bookmark => bookmark.story.toString() === req.params.id)
              .length > 0
          ) {
            // Story have been liked response to return json
            const removeIndex = user.bookmarks
              .map(bookmark => bookmark.story.toString())
              .indexOf(req.params.id);

            // Splice out of array
            user.bookmarks.splice(removeIndex, 1);

            // Save
            user.save().then(user => res
              .status(400)
              .json({
                bookmarked: false,
                ser: user,
              }));

            // Add user id to likes array
            // user.bookmarks.unshift({ post: req.params.id  });
          // Save the User instance
            // user.save().then(story => res.json(story));
          } else if (user.bookmarks.filter(bookmark => bookmark.story.toString() === req.params.id)
            .length === 0) {
            user.bookmarks.unshift({ story: req.params.id });
            user.save().then(user => res.json({
              bookmarked: true,
              user,
            }));
          }
        })
        .catch((err) => {
          res.status(404).json({ postnotfound: 'No post found' });
        // If any error Cache it
        });
    });
  },
);

module.exports = router;
