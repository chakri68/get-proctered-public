import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/env.js";
import prisma from "../../prisma/prisma.js";
import { verifyToken } from "../../services/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { data, error } = await verifyToken(req.cookies);

    if (error || !data) {
      throw new Error(error);
    }

    const user = await prisma.user.findUnique({
      where: {
        id: data.id,
      },
    });

    return res.status(200).json({
      message: "Authorized",
      data: { ...data, ...user },
    });
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message,
    });
  }
});

export default router;
