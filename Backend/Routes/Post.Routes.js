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
router.get("/userpost/all", isAuth, getuserpost);

// delete post
router.delete("/delete/:id", isAuth, delpost);

/* -------- LIKES -------- */

router.put("/:id/like", isAuth,likepost);
router.put("/:id/dislike", isAuth,Dislikepost);

/* -------- COMMENTS -------- */

// add comment
router.post("/:id/comment", isAuth, comment);

// get comments of a post
router.get("/:id/comment/all", isAuth, getcommentsofpost);

/* -------- BOOKMARK -------- */

router.put("/:id/bookmark", isAuth, bookmarkpost);

export default router;
