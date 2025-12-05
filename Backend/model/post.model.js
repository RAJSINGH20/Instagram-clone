import mongoose from "mongoose";

const postschema = new mongoose.Schema({
    caption:{
        type:String,
        default:''
    },
    author:{
        type:mongoose.Schema.type.objectId,
        ref:'User',
        required:true
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    
})
export const Post = mongoose.model('Post', postschema);