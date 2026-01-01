import cloudinary from "../util/Cloudinary.js"

import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dataUri from "../util/Datauri.js";
import { Post } from "../model/post.model.js";
import mongoose from "mongoose";

export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        
        const user = await User.findOne({ email })
        
        if (user) {
            return res.status(400).json({ message: "User already exists" })
        }
        console.log(req.body)

        const hashedPassword = await bcrypt.hash(password, 10);



        const newUser = new User({ username, email, password: hashedPassword })
        await newUser.save();




        res.status(200).json({ message: "User registered successfully", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false , error })
    }
}



export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, userFound.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const token = jwt.sign(
            { id: userFound._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log("Generated Token:", token); // ✅ Debugging line

        const populatedUser = await Promise.all(
          userFound.posts.map(async (postid) => {
            const post = await Post.findById(postid)

            if(post.author.equals(userFound._id)){
                return post;
            }
            return null;
          })
        )

        const user = {
            _id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            profilepic: userFound.profilepic,
            bio: userFound.bio,
            followers: userFound.followers,
            following: userFound.following,
            posts: populatedUser
        };

        // ✅ Set cookie and send response only ONCE
        
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        console.log(user)
        console.log(req.body)

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" }).json({ message: "Logout successful", success: true })  
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
export const Getprofile = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("userid:", id);

    // ✅ Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user id",
        success: false,
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const editprofile = async (req, res) => {
  try {
    console.log("edit profile entered");

    const userid = req.params.id;  // ✅ FIXED
    const { bio, gender } = req.body;
    const profilePic = req.file;

    console.log(userid, bio, gender, profilePic);

    let cloudResponse;

    if (profilePic) {
      const fileUri = dataUri(profilePic);

      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "profilepic",
        resource_type: "image",
      });
    }

    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const user = await User.findById(userid).select("-password");
    if (!user) {
      console.log("user not found", user);
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    if (profilePic && cloudResponse) {
      user.profilepic = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};




export const getsuggestedUsers = async (req, res) => {

    try {
        const suggestedUser = await User.find({ _id: { $ne: req.id } }).select("-password");

        if(!suggestedUser){
            return res.status(404).json({ message: "Currently don't have any suggested users", success: false })
        }

        res.status(200).json({ users: suggestedUser, success: true })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}


export const followorunfollowuser = async (req, res) => {
  try {
    const followkarnewala = req.user.id;
    const jiskofollowkarunga = req.params.id;

    if (followkarnewala === jiskofollowkarunga) {
      return res.status(400).json({
        message: "You cannot follow yourself",
        success: false,
      });
    }

    const user = await User.findById(followkarnewala);
    const targetUser = await User.findById(jiskofollowkarunga);

    const isFollowing = user.following.some(
      id => id.toString() === jiskofollowkarunga
    );
    console.log("user :",user)

    if (isFollowing) {
      // 🔴 UNFOLLOW
      await Promise.all([
        User.findByIdAndUpdate(followkarnewala, {
          $pull: { following: jiskofollowkarunga },
        }),
        User.findByIdAndUpdate(jiskofollowkarunga, {
          $pull: { followers: followkarnewala },
        }),
      ]);

      return res.json({
        message: "Followed successfully",
        success: true,
      });
    } else {
      // 🟢 FOLLOW
      await Promise.all([
        User.findByIdAndUpdate(followkarnewala, {
          $addToSet: { following: jiskofollowkarunga },
        }),
        User.findByIdAndUpdate(jiskofollowkarunga, {
          $addToSet: { followers: followkarnewala },
        }),
      ]);

      return res.json({
        message: "UnFollowed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

