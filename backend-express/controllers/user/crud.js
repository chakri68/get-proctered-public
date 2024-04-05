import { Router } from "express";
import argon from "argon2";
import prisma from "../../prisma/prisma.js";
import multer from "multer";
import { getFaceDescriptors } from "../../services/check-face.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.post("/", upload.single("face"), async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const file = req.file;
    if (!file) throw new Error("Invalid request body");

    if (!email || !name || !password || !file) {
      return res.status(400).json({
        message: "Invalid request body",
      });
    }

    const encPwd = await argon.hash(password);

    const faceDescriptors = await getFaceDescriptors(file.buffer);

    const user = prisma.user.create({
      data: {
        email,
        name,
        password: encPwd,
        faceDescriptors: Array.from(faceDescriptors),
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = req.body;

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        name,
      },
    });

    res.json({
      message: "User updated",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    res.json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

export default router;
