import express from "express";
import { editprofile, followorunfollowuser, Getprofile, getsuggestedUsers, Login, Logout, Register } from "../Controller/User.controller.js";
import { isAuth } from "../middlewares/isSuthmiddleware.js";
import upload from "../middlewares/multer.js";
const router = express.Router();

router.post("/signup", Register);
router.post("/login", Login);
router.get("/logout", Logout);
router.get("/:id/profile",isAuth, Getprofile);
router.post("/profile/edit", isAuth, upload.single('profilePicture')  ,editprofile);
router.get("/suggested",isAuth, getsuggestedUsers);
router.get("/FolloworUnfollow/:id",isAuth, followorunfollowuser);

export default router;