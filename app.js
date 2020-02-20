const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const dotenv = require("dotenv").config();

const contentHome = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const contentAbout = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contentContact = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0-xh2y4.gcp.mongodb.net/blogTestDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please, add a Title!"]
  },
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {

  Post.find({}, (err, foundPosts) => {

    if (err) {
      console.log(err);
    } else {

      if (foundPosts.length === 0) {
        const defaultPost = new Post ({
          title: "First post",
          content: "Nunc vel dui enim. Aliquam ac auctor neque. Nam nec vulputate velit. Vivamus scelerisque orci non risus gravida tempor ac eget diam. Integer ante velit, eleifend ac odio vel, posuere posuere risus. Duis auctor accumsan pulvinar. In eu ullamcorper felis. Morbi sed sem eu justo tempus dictum vel et purus. Morbi ipsum velit, viverra nec justo nec, ultrices porta ligula."
        });
        defaultPost.save(err => {
          if (!err) {
            res.redirect("/");
          }
        });

      } else {
        res.render("home", {contentHome: contentHome, contentPosts: foundPosts});
      }

    }

  });
});

app.get("/posts/:_id", (req, res) => {
  const postId = req.params._id;

  Post.findById(postId, (err, post) => {
    if (err) {
      res.render("post", {post: {
        title: 404,
        content: "Post not found"
      }});
    } else {
      res.render("post", {post: post});
    }
  });

});

app.get("/contact", (req, res) => {
  res.render("contact", {contentContact: contentContact});
});

app.get("/about", (req, res) => {
  res.render("about", {contentAbout: contentAbout});
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {

  const newPost = new Post ({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  newPost.save(err => {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
