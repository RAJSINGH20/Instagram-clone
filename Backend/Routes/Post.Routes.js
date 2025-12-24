import express from "express";
import {
  addpost,
  getallposts,
  getuserpost,
  comment,
  getcommentsofpost,
  delpost,
  bookmarkpost,
  likepost,
  Dislikepost
} from "../Controller/Post.Controller.js";

import {isAuth} from "../middlewares/isSuthmiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/* -------- POSTS -------- */

// create post
router.post(
  "/add",
  isAuth,
  upload.single("image"),
  addpost
);

// get all posts
router.get("/all", isAuth, getallposts);

// get logged-in user's posts
router.get("/user", isAuth, getuserpost);

// delete post
router.delete("/:id", isAuth, delpost);

/* -------- LIKES -------- */

router.put("/like/:postid", isAuth,likepost);
router.put("/dislike/:postid", isAuth,Dislikepost);

/* -------- COMMENTS -------- */

// add comment
router.post("/comment/:id", isAuth, comment);

// get comments of a post
router.get("/comment/:id", isAuth, getcommentsofpost);

/* -------- BOOKMARK -------- */

router.put("/bookmark/:id", isAuth, bookmarkpost);

export default router;
