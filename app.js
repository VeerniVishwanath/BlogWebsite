const express = require("express");
const app = express();
const _ = require("lodash");
const mongoose = require("mongoose");

main().catch((err) => {
  console.log(err);
});

// Mongoose main function
async function main() {
  // Mongoose Connections
  const url =
    "mongodb+srv://admin-vishwanath:hpK23yqf2ro0SpI2@cluster0.olpmf.mongodb.net";
  const Path = "/blogDB";
  await mongoose.connect(url + Path);

  // Post Schema
  const postSchema = new mongoose.Schema({
    title: String,
    post: String,
  });

  // Post Model
  const Post = new mongoose.model("Post", postSchema);

  const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
  const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

  app.set("view engine", "ejs"); //Using EJS

  app.use(express.urlencoded({ extended: true })); //BodyParser
  app.use(express.static("public")); //Declaring Static files

  // Get Home
  app.get("/", (req, res) => {
    // Find and save all posts in posts collection
    Post.find({}, (err, foundPosts) => {
      if (!err) {
        // if The db is empty
        if (foundPosts.length === 0) {
          // Create Home Document
          const Home = new Post({
            title: "HOME",
            post: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
          });
          Home.save((err) => {
            if (!err) {
              res.redirect("/");
            }
          });
        } else {
          res.render("home", { posts: foundPosts });
        }
      } else {
        console.log(err);
      }
    });
  });
  // Get About
  app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
  });
  // Get Contact
  app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
  });
  // Get Compose
  app.get("/compose", (req, res) => {
    res.render("compose");
  });

  // Get Posts
  app.get("/posts/:postTitle", (req, res) => {
    const postTitle = _.lowerCase(req.params.postTitle);

    Post.find({}, (err, foundPosts) => {
      if (!err) {
        foundPosts.forEach((postItem) => {
          const title = _.lowerCase(postItem.title);
          if (title == postTitle) {
            res.render("post", { title: postItem.title, post: postItem.post });
          }
        });
      } else {
        console.log(err);
      }
    });

    // posts.forEach((value) => {
    //   const title = _.lowerCase(value.title);
    //   if (postTitle == title) {
    //     res.render("post", { title: value.title, post: value.post });
    //   }
    // });
  });

  // Post Compose
  app.post("/compose", (req, res) => {
    // Create a new Document
    const newPost = new Post({
      title: req.body.composeTitle,
      post: req.body.composePost,
    });
    newPost.save((err) => {
      if (!err) {
        res.redirect("/");
      }
    });
  });
}

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
