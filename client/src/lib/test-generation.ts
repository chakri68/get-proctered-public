import { Question } from "@/providers/TestProvider/TestProvider";

export function countPossibleCombinations(
  questionBank: ({ marks: number } & any)[],
  totalMarks: number
) {
  const questions = questionBank.toSorted((a, b) => a.marks - b.marks);
  const result: Question[][] = [];

  function dfs(cur: Question[], idx: number, sum: number) {
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

  return result.length;
}
