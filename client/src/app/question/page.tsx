"use client";
import React, { useEffect, useMemo, useState } from "react";
import QuestionNavbar from "../../components/QuestionNavbar";
import Question from "../../components/Question";
import useMouseAnalytics from "@/hooks/useMouseAnalytics";
import WebcamCapture from "../../components/WebCam";
const Page = () => {

  // useMouseAnalytics()

  const questionList = useMemo(
    () => [
      {
        index: 1,
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Rome"],
      },
      {
        index: 2,
        question: "Who wrote 'Hamlet'?",
        options: [
          "William Shakespeare",
          "Charles Dickens",
          "Jane Austen",
          "Leo Tolstoy",
        ],
      },
      {
        index: 3,
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
      },
      {
        index: 4,
        question: "What is the chemical symbol for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
      },
      {
        index: 5,
        question: "Who painted the Mona Lisa?",
        options: [
          "Leonardo da Vinci",
          "Vincent van Gogh",
          "Pablo Picasso",
          "Michelangelo",
        ],
      },
      {
        index: 6,
        question: "Which continent is the largest by land area?",
        options: ["Asia", "Africa", "North America", "Europe"],
      },
      {
        index: 7,
        question: "What is the tallest mammal?",
        options: ["Elephant", "Giraffe", "Horse", "Rhino"],
      },
      {
        index: 8,
        question: "What is the primary ingredient in guacamole?",
        options: ["Tomato", "Avocado", "Onion", "Lemon"],
      },
      {
        index: 9,
        question: "Which element has the chemical symbol 'Fe'?",
        options: ["Iron", "Gold", "Silver", "Copper"],
      },
      {
        index: 10,
        question: "Who is the author of 'The Great Gatsby'?",
        options: [
          "F. Scott Fitzgerald",
          "Ernest Hemingway",
          "Mark Twain",
          "Jane Austen",
        ],
      },
      {
        index: 11,
        question: "What is the largest ocean on Earth?",
        options: [
          "Atlantic Ocean",
          "Indian Ocean",
          "Pacific Ocean",
          "Arctic Ocean",
        ],
      },
      {
        index: 12,
        question: "Who discovered penicillin?",
        options: [
          "Alexander Fleming",
          "Louis Pasteur",
          "Marie Curie",
          "Gregor Mendel",
        ],
      },
      {
        index: 13,
        question: "Which gas do plants absorb for photosynthesis?",
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      },
      {
        index: 14,
        question: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Hg"],
      },
      {
        index: 15,
        question: "Who wrote 'To Kill a Mockingbird'?",
        options: [
          "Harper Lee",
          "J.K. Rowling",
          "Stephen King",
          "George Orwell",
        ],
      },
      {
        index: 16,
        question: "What is the largest organ in the human body?",
        options: ["Brain", "Heart", "Liver", "Skin"],
      },
      {
        index: 17,
        question: "Who invented the telephone?",
        options: [
          "Alexander Graham Bell",
          "Thomas Edison",
          "Nikola Tesla",
          "Guglielmo Marconi",
        ],
      },
      {
        index: 18,
        question: "What is the chemical symbol for silver?",
        options: ["Si", "S", "Ag", "Sr"],
      },
      {
        index: 19,
        question: "Who painted 'The Starry Night'?",
        options: [
          "Vincent van Gogh",
          "Leonardo da Vinci",
          "Pablo Picasso",
          "Claude Monet",
        ],
      },
      {
        index: 20,
        question: "What is the currency of Japan?",
        options: ["Yen", "Dollar", "Euro", "Pound"],
      },
    ],
    []
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(1);
  useEffect(() => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const questionIndex = parseInt(hash);
      if (
        !isNaN(questionIndex) &&
        questionIndex > 0 &&
        questionIndex <= questionList.length
      ) {
        setCurrentQuestionIndex(questionIndex);
      }
    }
  }, [questionList]);
  const getCurrentQuestion = (): Question | undefined => {
    return questionList.find(
      (question) => question.index === currentQuestionIndex
    );
  };

  const [visitedUnmarkedQuestions, setVisitedUnmarkedQuestions] = useState<
    number[]
  >([]);

  const [markedForReviewQuestions, setMarkedForReviewQuestions] = useState<
    number[]
  >([]);
  const [submittedQuestions, setSubmittedQuestions] = useState<number[]>([]);
  // create a list answerList of size equal to the total amount of questions
  const [answerList, setAnswerList] = useState<number[]>(
    Array.from({ length: questionList.length }, () => -1)
  );
  return (
    <div>
      <QuestionNavbar />
      <div className="flex">
        <div className="flex h-[90vh] overflow-y-scroll bg-gray-800">
          <div className="bg-gray-800 text-white py-8 px-6 w-32 hidden md:block">
            <nav className="space-y-4">
              {/* <sle>
              
                    <FilterIcon className="w-4 h-4" />
                  <option>
                    <div className="flex items-center justify-between">
                      <span>Paris</span>
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    </div>
                  </option>
                  <option>London</option>
                  <option>Berlin</option>
                  <option>Madrid</option>
              </sle> */}
              {questionList.map((question) => {
                let bgClass = "";
                if (visitedUnmarkedQuestions.includes(question.index)) {
                  bgClass = "bg-red-500 text-black";
                } else if (markedForReviewQuestions.includes(question.index)) {
                  bgClass = "bg-purple-500";
                } else if (submittedQuestions.includes(question.index)) {
                  bgClass = "bg-green-500";
                } else {
                  bgClass = "bg-gray-700 hover:bg-gray-600";
                }

                return (
                  <a
                    key={question.index}
                    className={`block py-2 px-4 rounded-md ${bgClass} transition-colors text-center ${currentQuestionIndex === question.index ? "text-black" : "text-white"} ${currentQuestionIndex === question.index ? "font-bold" : ""} ${currentQuestionIndex === question.index ? "bg-yellow-500" : ""}`}
                    href={`#${question.index}`}
                    onClick={() => setCurrentQuestionIndex(question.index)}
                  >
                    {question.index}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <Question
          currentQuestion={getCurrentQuestion()}
          setCurrentQuestion={setCurrentQuestionIndex}
          setVisitedUnmarkedQuestions={setVisitedUnmarkedQuestions}
          setMarkedForReviewQuestions={setMarkedForReviewQuestions}
          setSubmittedQuestions={setSubmittedQuestions}
          setAnswerList={setAnswerList}
          answerList={answerList}
        />
        <WebcamCapture />
      </div>
    </div>
  );
};

export default Page;