import prisma from "../prisma/prisma.js";

/**
 * @param {string} testId
 * @param {string} userId
 */
export async function checkUserTest(testId, userId) {
  const test = await prisma.test.findUnique({
    where: {
      id: testId,
    },
  });

  if (!test) {
    return {
      message: "Test not found",
      data: null,
    };
  }

  const userTest = await prisma.testTaker.findFirst({
    where: {
      testId,
      userId,
    },
  });

  if (!userTest) {
    return {
      message: "User cannot take test",
      data: null,
    };
  }

  return { data: userTest, message: null };
}

export function getQuestions(questionBank, totalMarks) {
  // Sort the question bank based on marks in descending order
  questionBank.sort((a, b) => b.marks - a.marks);

  let selectedQuestions = [];
  let currentTotalMarks = 0;

  for (let question of questionBank) {
    if (currentTotalMarks + question.marks <= totalMarks) {
      selectedQuestions.push(question);
      currentTotalMarks += question.marks;
    }
    if (currentTotalMarks === totalMarks) {
      return selectedQuestions;
    }
  }

  // Not enough questions to reach the total marks
  return null;
}

export function getRandomCombination(questionBank, totalMarks) {
  const questions = questionBank.toSorted((a, b) => a.marks - b.marks);
  const result = [];

  function dfs(cur, idx, sum) {
    if (sum === totalMarks) {
      result.push([...cur]);
      return;
    }

    if (idx >= questions.length || sum > totalMarks) {
      return;
    }

    cur.push(questions[idx]);
    dfs(cur, idx + 1, sum + questions[idx].marks);
    cur.pop();

    while (
      idx + 1 < questions.length &&
      questions[idx] === questions[idx + 1]
    ) {
      idx++;
    }
    dfs(cur, idx + 1, sum);
  }

  dfs([], 0, 0);

  return result[Math.floor(Math.random() * result.length)];
}
