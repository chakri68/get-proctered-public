import { Router } from "express";
import multer from "multer";
import prisma from "../../prisma/prisma.js";
import {
  compareDescriptors,
  compareFaceToDescriptor,
  getFaceDescriptors,
} from "../../services/check-face.js";
import { z } from "zod";
import argon from "argon2";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../utils/env.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

const updateFaceSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post("/", upload.single("face"), async (req, res) => {
  try {
    const { email, password } = updateFaceSchema.parse(req.body);
    const file = req.file;
    if (!file) throw new Error("Invalid request body");

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check the password and face
    const validPassword = await argon.verify(user.password, password);

    if (!validPassword) {
      throw new Error("Invalid password");
    }

    const matches = await compareFaceToDescriptor(
      file.buffer,
      new Float32Array(user.faceDescriptors)
    );

    if (!matches) throw new Error("Face doesn't match");

    // Login successful
    // Set the cookie and return the user
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Login successful",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

export default router;