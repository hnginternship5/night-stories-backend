const mongoose = require('mongoose');
const Story = require('../../../models/Story')


exports.updateStory = (req, res) => {
    Story.findById(req.params.story_id, (err, story)=> {
        story.story_title = req.body.title
        story.story_description = req.body.description,
        story.designation = req.body.designation
        story.save((err, newStory)=> {
            if (err) return res.send(err)
            return res.send(newStory)
        })
    })
}