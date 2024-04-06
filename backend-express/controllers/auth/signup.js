import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import argon from "argon2";
import prisma from "../../prisma/prisma.js";
import { getFaceDescriptors } from "../../services/check-face.js";

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
      throw new Error("User already exists");
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

    res.json({
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