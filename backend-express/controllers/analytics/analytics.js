import { Router } from "express";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  // Get the test sessions for the test
  const testSessions = await prisma.testSession.findMany({
    include: {
      test: true,
      user: true,
    },
  });

  return res.json({
    testSessions,
  });
});

export default router;
