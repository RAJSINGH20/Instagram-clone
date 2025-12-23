import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 THIS LINE FIXES EVERYTHING
    req.user = decoded; // decoded MUST contain id

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default isAuth;
