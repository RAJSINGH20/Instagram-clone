import sharp from 'sharp';
import { Post } from '../model/post.model.js';
import { populate } from 'dotenv';
import User from '../model/user.model.js';
import {Comment} from '../model/comment.model.js'
import cloudinary from '../util/Cloudinary.js'


export const addpost = async (req, res) => {
  try {
    console.log("enterd in the addpost`")
    const { caption } = req.body;
    const image = req.file;
    const AuthorId = req.user.id;

    console.log("FILE:", image);
    console.log("BODY:", req.body);

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 720, height: 720, fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileuri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileuri, {
      folder: "postimages",
      resource_type: "image",
    });

    const newpost = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: AuthorId,
    });
    console.log(AuthorId)

    const user = await User.findById(AuthorId);
    if (user) {
      user.posts.push(newpost._id);
      await user.save();
    }

    await newpost.populate({
      path: "author",
      select: "_id name profilepic",
    });

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      post: newpost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


export const getallposts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate({ path: 'author', select: 'username, profilepic' }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilepic' } }).populate({ path: 'likes', select: 'username profilepic' });
        return res.status(200).json({
            message: "Posts fetched successfully",
            success: true,
            posts
        })
    } catch (error) {
        console.log(error)
    }
}


export const getuserpost = async (req, res) => {
    try {
        const { AuthorId } = req.id;
        const post = await Post.find({ author: AuthorId }).sort({ createdAt: -1 }).populate({ path: 'author', select: 'username, profilepic' }).populate({ path: 'comments', sort: { createdAt: -1 }, populate: { path: 'author', select: 'username profilepic' } }).populate({ path: 'likes', select: 'username profilepic' });

        return res.status(200).json({
            message: "User Posts fetched successfully",
            success: true,
            post
        })
    }
    catch (error) {
        console.log(error)
    }
}


export const likepost = async (req, res) => {
    try {
        const likekarnewalaid = req.id;
        const { postid } = req.params;

        const post = await Post.findById(postid);
        if (!post) return res.status(404).json({ message: "Post not found", success: false })

        await post.updateOne({ $addToSet: { likes: likekarnewalaid } });
        await post.save();
        //implement soket.io later for real time update of likes.
        return res.status(200).json({
            message: "Post liked successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}
export const Dislikepost = async (req, res) => {
    try {
        const likekarnewalaid = req.id;
        const { postid } = req.params;

        const post = await Post.findById(postid);
        if (!post) return res.status(404).json({ message: "Post not found", success: false })

        await post.updateOne({ $pull: { likes: likekarnewalaid } });
        await post.save();

        //implement soket.io later for real time update of likes.


        return res.status(200).json({
            message: "Post disliked successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const comment = async(req,res)=>{
    try {
        const postID = req.params.id;

        const commentkarnewalaid = req.id;
        const { text } = req.body;
        const post = await Post.findById(postID);

        if(!post){
            return res.status(400).json({ message: "user not found", success: false })
        }

        const comment = await Comment.create({
            text,
            author: commentkarnewalaid,
            post: postID
        }).populate({ path: 'author', select: 'username profilepic' });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            success: true,
            comment
        })
        
    } catch (error) {
        console.log(error)
    }
}

export const getcommentsofpost = async(req,res)=>{
    try {
        const postid = req.params.id;
        const comments = await comment.find({post:postid}).populate({ path: 'author', select: 'username profilepic' });

        if(!comments){
            return res.status(404).json({ message: "No comments found for this post", success: false })
        }

        return res.status(200).json({
            message: "Comments fetched successfully",
            success: true,
            comments
        })

    } catch (error) {
        
        console.log(error)
    }
}

export const delpost = async(req,res)=>{

    try {
        const postid = req.params.id;
        const authorid = req.id;
        const post = await Post.findById(postid);
        if(!post){
            return res.status(404).json({ message: "Post not found", success: false })
        }
        // check if the logged in user is the owner of the post

        if(post.author.toString() !== authorid){
            return res.status(403).json({ message: "You are not authorized to delete this post", success: false })
        }
        // delete post

        await Post.findByIdAndDelete(postid)

        // also remove post from user's post array

        let user = await User.findById(authorid);
        user.posts = user.posts.filter((postId)=> postId.toString() !== postid);
        await user.save();

        //delete all comments associated with the post

        await comment.deleteMany({post:postid});

        return res.status(200).json({ message: "Post deleted successfully", success: true })
        
    } catch (error) {
        console.log(error)
    }

}

export const bookmarkpost = async(req,res)=>{
    try {
        const postid = req.params.id;
        const authorid = req.id;

        let post = await Post.findById(postid);
        if(!post){
            return res.status(404).json({ message: "Post not found", success: false })
        }

        const user = await User.findById(authorid);
        if(!user){
            return res.status(404).json({ message: "User not found", success: false })
        }

        if(user.bookmarks.includes(postid)){

            await user.updateOne({ $pull: { bookmarks: postid } });
            await user.save();
            return res.status(200).json({ message: "Post removed from bookmarks", success: true })
        }else{
            await user.updateOne({ $addToSet: { bookmarks: postid } });
            await user.save();
            return res.status(200).json({ message: "Post bookmarked successfully", success: true })
        }




    }catch (error) {
        console.log(error)
    }
}