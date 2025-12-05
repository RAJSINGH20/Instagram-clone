import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilepic: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender:{
        type: String,
        // The enum field is correct for restricting values
        enum: ['male', 'female', 'other'], 
        default: ''
    },
    // Followers should be an array of ObjectIds referencing other User documents
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId, // Corrected casing and path
            ref: 'User'
        }
    ],
    // Following should be an array of ObjectIds referencing other User documents
    following: [
        {
            type: mongoose.Schema.Types.ObjectId, // Corrected casing and path
            ref: 'User'
        }
    ],
    // Posts should be an array of ObjectIds referencing Post documents
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId, // Corrected casing and path
            ref: 'Post',
        }
    ],
    // Bookmarks should be an array of ObjectIds referencing Post documents
    bookmark: [
        {
            type: mongoose.Schema.Types.ObjectId, // Corrected casing and path
            ref: 'Post',
        }
    ]

}, {timestamps: true}); // `timestamps: true` is correct for adding `createdAt` and `updatedAt`

const User = mongoose.model('User', userschema);

export default User;