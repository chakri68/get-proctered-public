import { Router } from "express";
import prisma from "../../prisma/prisma.js";
import checkAuth from "../../middleware/auth.js";

const router = Router();

// Middleware to check if the user is authenticated
router.use(checkAuth);

router.post("/:id/start-test", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) throw new Error("Not Authorized");

    const { id: userId } = user;

    const test = await prisma.test.findUnique({
      where: {
        id,
      },
    });

    if (!test) {
      return res.status(404).json({
        message: "Test not found",
      });
    }

    // Check if a test session already exists
    const testSession = await prisma.testSession.findFirst({
      where: {
        testId: id,
        status: "IN_PROGRESS",
      },
    });

    if (testSession) {
      const prevEvents = testSession.events || [];
      if (!Array.isArray(prevEvents)) {
        return res.status(400).json({
          message: "Invalid test session",
        });
      }
      // Store it as an event
      await prisma.testSession.update({
        where: {
          id: testSession.id,
        },
        data: {
          events: [
            {
              type: "SESSION_RESTART",
              timestamp: new Date(),
            },
            ...prevEvents,
          ],
        },
      });

      return res.status(400).json({
        message: "Test session already in progress",
      });
    }

    const session = await prisma.testSession.create({
      data: {
        testId: id,
        status: "IN_PROGRESS",
        events: [
          {
            type: "SESSION_START",
            timestamp: new Date(),
          },
        ],
        answers: [],
        startTime: new Date(),
        endTime: null,
        userId: userId,
      },
    });

    return res.json({
      message: "Test session started",
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      message: "Invalid request",
      error: err.message,
    });
  }
});

export default router;
