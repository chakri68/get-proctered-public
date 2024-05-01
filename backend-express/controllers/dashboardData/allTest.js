import { Router } from "express";
import prisma from "../../prisma/prisma.js";

const router = Router();

router.get("/", async (req, res) => {
  // Get all tests
  const tests = await prisma.test.findMany({
    include: {
      TestTaker: true,
    },
  });
  return res.json({
    tests,
  });
});

// delete test having id = testId

router.post("/deleteTest/:id", async (req, res) => {
  try {
    const { id: testId } = req.params;
    const test = await prisma.test.delete({
      where: {
        id: testId,
      },
    });
    return res.json({
      test,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
router.get("/getTest/:id", async (req, res) => {
  try {
    const { id: testId } = req.params;
    console.log(testId)
    const testSessions = await prisma.testSession.findMany({
      where: {
        testId: testId,
      },
      include: {
        user: true,
        test: true
      },
    });

    // Calculate marks for each test session
    const testSessionsWithMarks = testSessions.map((session) => {
      const marks = calculateMarks(session.answers, session.test.questions);
      return { ...session, marks };
    });

    return res.json({
      testSessions: testSessionsWithMarks,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// Function to calculate marks for a session
function calculateMarks(answers, questions) {
  let totalMarks = 0;
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (question) {
      const selectedOption = question.options.find(
        (opt) => opt.id === answer.optionId
      );
      if (selectedOption && selectedOption.isCorrect) {
        totalMarks += question.marks;
      }
    }
  });
  return totalMarks;
}


export default router;