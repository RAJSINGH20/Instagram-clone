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

        const user = {
            _id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            profilepic: userFound.profilepic,
            bio: userFound.bio,
            followers: userFound.followers,
            following: userFound.following,
            posts: userFound.posts
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
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
