import express from "express";
import {
  addpost,
  getallposts,
  getuserpost,
  comment,
  getcommentsofpost,
  delpost,
  bookmarkpost
} from "../Controller/Post.Controller.js";

import {isAuthenticated} from "../middlewares/isSuthmiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/* -------- POSTS -------- */

// create post
router.post(
  "/add",
  isAuthenticated,
  upload.single("image"),
  addpost
);

// get all posts
router.get("/all", isAuthenticated, getallposts);

// get logged-in user's posts
router.get("/user", isAuthenticated, getuserpost);

// delete post
router.delete("/:id", isAuthenticated, delpost);

/* -------- LIKES -------- */

router.put("/like/:postid", isAuthenticated, likepost);
router.put("/dislike/:postid", isAuthenticated, Dislikepost);

/* -------- COMMENTS -------- */

// add comment
router.post("/comment/:id", isAuthenticated, comment);

// get comments of a post
router.get("/comment/:id", isAuthenticated, getcommentsofpost);

/* -------- BOOKMARK -------- */

router.put("/bookmark/:id", isAuthenticated, bookmarkpost);

export default router;
