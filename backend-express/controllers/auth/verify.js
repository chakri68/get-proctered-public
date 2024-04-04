import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/env.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      throw new Error("No token provided");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      throw new Error("Invalid token");
    }
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
});

export default router;
