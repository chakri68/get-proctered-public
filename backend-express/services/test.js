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
  // Initialize an array to store all possible combinations for each total mark
  let combinations = new Array(totalMarks + 1).fill(null).map(() => []);

  // There is 1 possible combination to get 0 total marks (no questions selected)
  combinations[0].push([]);

  // Iterate through each question in the question bank
  for (let question of questionBank) {
    // Iterate through each mark from totalMarks down to question's marks
    for (let i = totalMarks; i >= question.marks; i--) {
      // Add the combinations for the current mark by adding the combinations for (current mark - question's marks)
      for (let prevCombination of combinations[i - question.marks]) {
        combinations[i].push([...prevCombination, question]);
      }
    }
  }

  console.log({ combinations });

  // Select a random combination from all possible combinations for the given total marks
  let randomIndex = Math.floor(Math.random() * combinations[totalMarks].length);
  return combinations[totalMarks][randomIndex];
}
