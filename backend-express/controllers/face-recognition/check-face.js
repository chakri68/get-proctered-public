import { Router } from "express";
import multer from "multer";
import prisma from "../../prisma/prisma.js";
import {
  compareDescriptors,
  getFaceDescriptors,
} from "../../services/check-face.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/", upload.single("face"), async (req, res) => {
  try {
    const userId = req.body.id;
    const file = req.file;

    if (!file || userId) {
      throw new Error("Invalid request body");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const realDescriptor = new Float32Array(user.faceDescriptors);
    const uploadedDescriptor = await getFaceDescriptors(file.buffer);

    // Compare the descriptors
    const distance = await compareDescriptors(
      realDescriptor,
      uploadedDescriptor
    );

    if (distance > 0.6) {
      throw new Error("Face does not match");
    }

    res.json({
      message: "Face matched",
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

export default router;
