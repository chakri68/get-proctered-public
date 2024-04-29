export function countPossibleCombinations(
  questionBank: {
    question: string;
    options: {
      option: string;
      isCorrect: boolean;
    }[];
    marks: number;
    type: "singlecorrect" | "multicorrect";
  }[],
  totalMarks: number
) {
  // Initialize an array to store the counts of possible combinations for each total mark
  let count: number[] = new Array(totalMarks + 1).fill(0);

  // There is 1 possible combination to get 0 total marks (no questions selected)
  count[0] = 1;

  // Iterate through each question in the question bank
  for (let question of questionBank) {
    // Iterate through each mark from totalMarks down to question's marks
    for (let i = totalMarks; i >= question.marks; i--) {
      // Add the count of combinations for the current mark by adding the count of combinations for (current mark - question's marks)
      count[i] += count[i - question.marks];
    }
  }

  // Return the count of possible combinations for the given total marks
  return count[totalMarks];
}
