import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log("token", token);

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ INITIALIZE req.user FIRST
    req.user = {
      id: decoded.id || decoded.userid, // support both
    };

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};
