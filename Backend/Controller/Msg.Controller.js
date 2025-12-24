// for chatting 

import { Conversation } from "../model/conversation .model.js";
import Message from "../model/message.model.js";


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants:{ $all: [senderId, receiverId]  }
        })

        // established the conversation if not exists
        if (!conversation) {
            conversation = await new Conversation.create({
                participants: [senderId, receiverId],
            })
        }
        const newmessege = await Message.create({
            senderId,
            receiverId,
            message,
        });
        if(newmessege) conversation.messages.push(newmessege._id);
        await Promise.all([conversation.save(),newmessege.save()]);



        //implement soket.io for real time data transfer



        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            newmessege
        })



    } catch (error) {
        console.log(error)
    }
}


export const getMessages = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if(!conversation) return res.status(200).json({message:"Conversation not found",messages:[]})

        return res.status(200).json({
            message: "Messages fetched successfully",
            success: true,
            Message
        })
    } catch (error) {
        console.log(error)
    }
}