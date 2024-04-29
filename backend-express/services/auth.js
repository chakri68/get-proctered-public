import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js";

/**
 * @param {Parameters<import("express").RequestHandler>["0"]["cookies"]} cookies
 * @returns {Promise<{ data: import("jsonwebtoken").JwtPayload; message: null } | { data: null; message: string }>}
 */
export async function verifyToken(cookies) {
  const authToken = cookies["auth-token"];

  if (!authToken) {
    return {
      data: null,
      message: "No token provided",
    };
  }

  try {
    const decoded = jwt.verify(authToken, JWT_SECRET);

    if (!decoded || typeof decoded === "string") {
      return {
        data: null,
        message: "Invalid token",
      };
    }

    return {
      data: decoded,
      message: null,
    };
  } catch (err) {
    return {
      data: null,
      message: err.message,
    };
  }
}
