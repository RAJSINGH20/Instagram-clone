import mongoose from "mongoose";

const commentschema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },  
    author:{
        type:mongoose.Schema.type.ObjectId,
        ref:'User',
        
    },
    post:{
        type:mongoose.Schema.type.ObjectId,
        ref:'Post',
        
    }

})
export const Comment = mongoose.model('Comment', commentschema);