import  jwt  from "jsonwebtoken";
export const isAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided", success: false });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token", success: false });
        }
        req.id = decoded.userid;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", success: false });
    }
};