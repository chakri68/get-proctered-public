import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import argon from "argon2";
import prisma from "../../prisma/prisma.js";
import jwt from "jsonwebtoken";
import { getFaceDescriptors } from "../../services/check-face.js";
import { JWT_SECRET } from "../../utils/env.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

const accountCreationSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
});

router.post("/", upload.single("face"), async (req, res) => {
  try {
    const { email, password, name } = accountCreationSchema.parse(req.body);
    const file = req.file;
    if (!file) throw new Error("Invalid request body");

    // Check of the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      // Update the user's face descriptors
      const faceDescriptors = await getFaceDescriptors(file.buffer);
      const user = await prisma.user.update({
        where: {
          email,
        },
        data: {
          faceDescriptors: Array.from(faceDescriptors),
        },
      });

      // Set the cookie and return the user
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "6h",
      });

      res.cookie("auth-token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 6,
      });

      return res.json({
        message: "Face updated",
        data: user,
      });
    }

    const encPwd = await argon.hash(password);
    const faceDescriptors = await getFaceDescriptors(file.buffer);

    // Save the user to the database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: encPwd,
        faceDescriptors: Array.from(faceDescriptors),
      },
    });

    // Set the cookie and return the user
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "6h",
    });

    res.cookie("auth-token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 6,
    });

    return res.json({
      message: "User created",
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
