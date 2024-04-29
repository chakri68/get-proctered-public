import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js";
import { verifyToken } from "../services/auth.js";

/**
 * @type {import("express").RequestHandler}
 */
const checkAuth = async (req, res, next) => {
  try {
    const { data, error } = await verifyToken(req.cookies);

    console.log({ data, error });

    if (error || !data) {
      throw new Error(error);
    }

    const { email, id } = data;

    // Set the user in the request object
    req.user = {
      email,
      id,
    };

    console.log({ user: req.user });

    // Call the next middleware
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default checkAuth;
