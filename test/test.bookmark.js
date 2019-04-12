const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../src/app.js");
chai.use(chaiHttp);
require("chai/register-should");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Category = mongoose.model("Category");
const Story = mongoose.model("Story");
const User = mongoose.model("User");
const Bookmark = mongoose.model("Bookmark");

//Admin User
const user = new User();
user.name = "John Doe Chioma";
user.email = "test@naptales.com";
user.password = bcrypt.hashSync("password", 10);
user.designation = "year 5 and above";
user.is_admin = true;
user.is_premium = true;
user.save();
const userId = user._id;
const token = user.generateJWT();

// New Category
const category = new Category();
category.name = "Tortise Tales";
category.save();
const catId = category._id;

// New Story
const storyModel = new Story();
storyModel.title = "Who shall bell the Cat";
storyModel.story =
  "The cat bad gunn. The rats needed a saviour and rat Jerry came to the rescue";
storyModel.cat_id = catId;
storyModel.designation = "48933489";
const storyId = storyModel._id;

const storyModel2 = new Story();
storyModel2.title = "Dog goes to school";
storyModel2.story =
  "Once upon a time there was an intelligent Dog and he went to school";
storyModel2.cat_id = catId;
storyModel2.designation = "48933489";
const storyId2 = storyModel2._id;

// New Bookmark
const newBookmark = new Bookmark();
newBookmark.user = userId;
newBookmark.story = storyId2;
newBookmark.save();
const bookmarkId = newBookmark._id;

// Test Add Bookmark
describe("/POST BOOKMARK", () => {
  it("should add a bookmark", done => {
    chai
      .request(app)
      .post("/api/v1/bookmark/add")
      .set("authorization", token)
      .send({ story: storyId, user: userId })
      .end((err, res) => {
        res.should.have.property("status", 200);
        done();
      });
  });
});

// Get A Bookmark
describe("/GET BOOKMARK", () => {
  it("should get a single bookmark ", done => {
    chai
      .request(app)
      .get(`/api/v1/bookmark/${bookmarkId}`)
      .set("authorization", token)
      .end((err, res) => {
        res.should.have.property("statusCode", 200);
        done();
      });
  });

  it("should not get a bookmark with wrong id", done => {
    let id = "kdadsf478347";
    chai
      .request(app)
      .get(`/api/v1/bookmark/${id}`)
      .set("authorization", token)
      .end((err, res) => {
        let result = JSON.parse(res.text);
        result.should.have.property("message", "Invalid Bookmark Id");
        done();
      });
  });
});

// Delete a bookmark
describe("/DELETE BOOKMARK", () => {
  it("should delete a bookmark", done => {
    chai
      .request(app)
      .delete(
        `/api/v1/bookmark/delete/bookmark_id/${bookmarkId}/user_id/${userId}`
      )
      .set("authorization", token)
      .end((err, res) => {
        let result = JSON.parse(res.text);
        result.should.have.property("message", "bookmark deleted successfully");
        done();
      });
  });
});
