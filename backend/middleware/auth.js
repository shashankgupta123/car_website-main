import jwt from "jsonwebtoken";
import User from "../Models/user-models.js";

// Function to generate JWT token and set it as a cookie
const generateTokenAndSetCookie = (id, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || 'shashankgupta';
  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "15d", // Token expiration time
  });

  // Set the token as an HTTP-only cookie
  res.cookie("token-CineFilm", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevents access to the cookie via JavaScript
    sameSite: "strict", // Prevents CSRF attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookie in production
  });

  return token;
};

// Middleware to protect routes by checking if the user is authenticated
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from the header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request object
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Proceed to next middleware or route handler
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized, token is invalid or expired",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};

// Middleware to check if the user is an admin
const admin = async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    return res.status(403).json({
      success: false,
      message: "Not authorized, user is not an admin",
    });
  }
};

export { generateTokenAndSetCookie, protect, admin };
