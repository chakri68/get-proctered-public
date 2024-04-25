import React, { useEffect, useState } from "react";

interface Question {
  index: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Props {
  currentQuestion?: Question;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  setVisitedUnmarkedQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  setMarkedForReviewQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  setSubmittedQuestions: React.Dispatch<React.SetStateAction<number[]>>;
  setAnswerList: React.Dispatch<React.SetStateAction<number[]>>;
  answerList: number[];
}

const Question: React.FC<Props> = ({
  currentQuestion,
  setCurrentQuestion,
  setVisitedUnmarkedQuestions,
  setMarkedForReviewQuestions,
  setSubmittedQuestions,
  setAnswerList,
  answerList,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  useEffect(() => {
    // check if the current question is already answered in the answerList
    const answer = answerList[currentQuestion.index - 1];
    if (answer !== -1) {
      setSelectedOption(answer);
    } else {
      setSelectedOption(null);
    }
  }, [currentQuestion, answerList]);

  const handleOptionSelect = (optionIndex: number) => {
    console.log(optionIndex);
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (currentQuestion) {
      setVisitedUnmarkedQuestions((prev) => [...prev, currentQuestion.index]);
      console.log(answerList);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleMarkForReview = () => {
    console.log(selectedOption);
    console.log("CUrremt sjjs", currentQuestion);
    setMarkedForReviewQuestions((prev) => [...prev, currentQuestion.index]);
    if (selectedOption !== null) {
      setAnswerList((prev) => {
        const updatedList = [...prev];
        updatedList[currentQuestion.index - 1] = selectedOption;
        return updatedList;
      });
      console.log(answerList);
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleSubmit = () => {
    setSubmittedQuestions((prev) => [...prev, currentQuestion.index]);
    if (selectedOption !== null) {
      setAnswerList((prev) => {
        const updatedList = [...prev];
        updatedList[currentQuestion.index - 1] = selectedOption;
        return updatedList;
      });
      console.log(answerList);
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  if (!currentQuestion) return null;

  return (
    <div
      className="flex flex-col bg-gray-100"
      style={{
        width: "100%",
      }}
    >
      <main
        className="flex-1 py-8 px-6"
        key={currentQuestion.index}
        id={currentQuestion.index.toString()}
      >
        <div className="max-w-xl mx-auto space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">{`Question ${currentQuestion.index}`}</h2>
            <p className="text-gray-700 dark:text-gray-400 mb-4">
              {currentQuestion.question}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`${
                    selectedOption !== optionIndex
                      ? "bg-gray-300"
                      : "bg-white dark:bg-gray-800 dark:text-white"
                  } rounded-lg py-3 px-4 hover:bg-gray-200 hover:text-white dark:hover:bg-gray-700 transition-colors`}
                  onClick={() =>
                    selectedOption !== optionIndex
                      ? handleOptionSelect(optionIndex)
                      : setSelectedOption(null)
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-4 px-6 flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleNext}
        >
          Next
        </button>
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded ml-2"
          onClick={handleMarkForReview}
        >
          Mark for Review & Next
        </button>
        <button
          disabled={selectedOption === null}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2 disabled:opacity-50"
          onClick={handleSubmit}
        >
          Submit & Next
        </button>
      </footer>
    </div>
  );
};

export default Question;
