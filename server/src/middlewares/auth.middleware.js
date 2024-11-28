import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


export const verifyJWT = asyncHandler( async(req, res, next) => {
  try {
    // Log to check if the cookie is being sent
    // console.log("Cookies:", req.cookies);
    
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);  // Replace with your secret key
    // console.log("Decoded token:", decoded);  // Log decoded token

    // Attach the user data to the request object
    req.user = decoded;  // Ensure this is being set correctly
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
})