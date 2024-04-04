import { Router } from "express";
import { z } from "zod";
import checkAuth from "../../middleware/auth.js";
import prisma from "../../prisma/prisma.js";
import multer from "multer";
import { getFaceDescriptors } from "../../services/check-face.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// Middleware to check if the user is authenticated
router.use(checkAuth);

const updateFaceSchema = z.object({
  userId: z.string(),
});

// POST route to store a face of a user
router.post("/", upload.single("face"), async (req, res) => {
  try {
    const { userId } = updateFaceSchema.parse(req.body);
    const file = req.file;
    if (!file) throw new Error("Invalid request body");

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const faceDescriptors = await getFaceDescriptors(file.buffer);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        faceDescriptors: Array.from(faceDescriptors),
      },
    });

    res.json({
      message: "Face updated",
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request body",
    });
  }
});

export default router;
