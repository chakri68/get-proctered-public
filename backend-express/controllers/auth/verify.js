import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/env.js";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const token = req.cookies["auth-token"];

    if (!token) {
      throw new Error("No token provided");
    }

    /**
     * @type {any}
     */
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!decoded) {
      throw new Error("Invalid token");
    }

    return res.json({
      message: "Token is valid",
      data: { ...decoded, ...user },
    });
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
});

export default router;
