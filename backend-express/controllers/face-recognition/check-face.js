import { Router } from "express";
import multer from "multer";
import prisma from "../../prisma/prisma.js";
import {
  compareDescriptors,
  compareFaceToDescriptor,
  getFaceDescriptors,
} from "../../services/check-face.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/", upload.single("face"), async (req, res) => {
  try {
    const { id: userId } = req.body;
    const file = req.file;

    if (!file || !userId) {
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

    const matches = await compareFaceToDescriptor(
      file.buffer,
      new Float32Array(user.faceDescriptors)
    );

    if (!matches) throw new Error("Faces don't match");

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
