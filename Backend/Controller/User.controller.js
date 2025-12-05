import User from "../model/user.model.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        const{ email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if(!user){
            return res.status(400).json({ message: "User does not exist" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })


        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts
        }

        res.status(200).json({ message: "Login successful", success: true, user, token })
        return res.cookie("token", token, { httpOnly: true , sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 }).json({ message: "Login successful", success: true, user, token })


    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

export const Logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" }).json({ message: "Logout successful", success: true })  
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
export const Getprofile = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
