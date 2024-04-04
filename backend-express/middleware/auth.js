import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js";

/**
 * @type {import("express").RequestHandler}
 */
const checkAuth = (req, res, next) => {
  try {
    // Get the auth token from the cookies
    const authToken = req.cookies["auth-token"];

    // Verify the token
    const decoded = jwt.verify(authToken, JWT_SECRET);

    if (!decoded) {
      throw new Error("Invalid token");
    }

    // @ts-ignore
    const { email, userId } = decoded;

    if (!email || !userId) {
      throw new Error("Invalid token");
    }

    // Set the user in the request object
    req.user = {
      email,
      id: userId,
    };

    // Call the next middleware
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default checkAuth;
