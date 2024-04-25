import { createContext, useContext, useState, createRef } from "react";
import { WebCamContext } from "@/providers/WebCamProvider/WebCamProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import useTestAnalytics from "@/hooks/useTestAnalytics";
import { NotifProvider } from "../NotifProvider/NotifProvider";

const MOCK_QUESTIONS = [
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
    options: ["Harper Lee", "J.K. Rowling", "Stephen King", "George Orwell"],
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
];

export enum QuestionStatus {
  SAVED,
  NOT_VISITED,
  MARKED_FOR_REVIEW,
  NOT_ANSWERED,
}

export type AnswerState = {
  questionId: string;
  status: QuestionStatus;
  optionId: string | null; // Index for now
};

export type Question = {
  id: string;
  question: string;
  options: Option[];
};

export type Option = {
  id: string;
  text: string;
};

export enum ErrorCode {
  INVALID_QUESTION_ID = "INVALID_QUESTION_ID",
  INVALID_OPTION_ID = "INVALID_OPTION_ID",
  INVALID_ANSWER = "INVALID_ANSWER",
  RECORDING_STOPPED = "RECORDING_STOPPED",
  FULLSCREEN_EXIT = "FULLSCREEN_EXIT",
}

export type Error = {
  message: string;
  code: ErrorCode;
};

export const TestContext = createContext<{
  errors: Error[];
  setErrors: (errors: Error[]) => void;
  answerState: AnswerState[];
  saveResponse: (questionId: string, optionId: string) => void;
  markForReview: (questionId: string, optionId: string | null) => void;
  clearResponse: (questionId: string) => void;
  submitTest: () => void;
  startTest: () => void;
  isTestStarted: boolean;
  getQuestionCount: () => number;
  testLoading: boolean;
  currentQuestion: Question;
  goToNextQuestion: () => void;
  goToQuestion: (questionId: string) => void;
  showViolationScreen: () => void;
  bannedFromTest: boolean;
}>({
  errors: [],
  setErrors: () => {},
  answerState: [],
  saveResponse: () => {},
  markForReview: () => {},
  clearResponse: () => {},
  submitTest: () => {},
  startTest: () => {},
  isTestStarted: false,
  getQuestionCount: () => 0,
  testLoading: false,
  currentQuestion: {
    id: "",
    question: "",
    options: [],
  },
  goToNextQuestion: () => {},
  goToQuestion: () => {},
  showViolationScreen: () => {},
  bannedFromTest: false,
});

export default function TestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isRecording } = useContext(WebCamContext);
  const { isFullScreen, makeFullscreen } = useContext(ScreenContext);
  const [errors, setErrors] = useState<Error[]>([]);
  const [answerState, setAnswerState] = useState<AnswerState[]>([]);
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    question: "",
    options: [],
  });
  const [testEnd, setTestEnd] = useState<boolean>(false);
  const [bannedFromTest, setBannedFromTest] = useState<boolean>(false);

  const testScreenEl = createRef<HTMLDivElement>();

  const onTestError = (err: Error) => {
    setErrors((prev) => [...prev, err]);
  };

  const showViolationScreen = () => {
    setBannedFromTest(true);
  };

  const { startService } = useTestAnalytics({
    onError: onTestError,
    showViolationScreen,
  });

  const goToNextQuestion = () => {
    const nextQuestionId =
      answerState.findIndex((ans) => ans.questionId === currentQuestion.id) + 1;
    if (nextQuestionId >= answerState.length) {
      return;
    }

    _fetchQuestion(answerState[nextQuestionId].questionId);
  };

  const goToQuestion = (questionId: string) => {
    _fetchQuestion(questionId);
  };

  const saveResponse = (questionId: string, optionId: string) => {
    setAnswerState((prev) => {
      const n = [...prev];
      const ans = n.find((ans) => ans.questionId === questionId)!;
      ans.status = QuestionStatus.SAVED;
      ans.optionId = optionId;
      return n;
    });
    goToNextQuestion();
  };

  const markForReview = (questionId: string, optionId: string | null) => {
    setAnswerState((prev) => {
      const n = [...prev];
      const ans = n.find((ans) => ans.questionId === questionId)!;
      ans.status = QuestionStatus.MARKED_FOR_REVIEW;
      ans.optionId = optionId;
      return n;
    });
    goToNextQuestion();
  };

  const clearResponse = (questionId: string) => {
    setAnswerState((prev) => {
      const n = [...prev];
      const ans = n.find((ans) => ans.questionId === questionId)!;
      ans.status = QuestionStatus.NOT_VISITED;
      ans.optionId = null;
      return n;
    });
  };

  const startTest = async () => {
    setTestLoading(true);
    startService(testScreenEl.current!);
    // Fetch question ids
    await (async () => {
      // Sleep for 7 second
      await new Promise((resolve) => setTimeout(resolve, 2000));
    })();
    const questionIds = await _fetchQuestionIds();
    setAnswerState(
      questionIds.map((questionId) => ({
        status: QuestionStatus.NOT_VISITED,
        optionId: null,
        questionId: questionId.toString(),
      }))
    );

    // Fetch first question
    await _fetchQuestion("1");

    setTestLoading(false);
    setIsTestStarted(true);
  };

  const submitTest = () => {
    console.log("Submitting test");
  };

  const _fetchQuestion = async (questionId: string) => {
    // Fetch question data from the server
    setTestLoading(true);
    // Fetch question data
    const question = MOCK_QUESTIONS.find(
      (q) => q.index.toString() === questionId
    ) as (typeof MOCK_QUESTIONS)[number];
    setCurrentQuestion({
      id: questionId,
      question: question.question,
      options: question.options.map((option, index) => ({
        id: index.toString(),
        text: option,
      })),
    });

    setTestLoading(false);
  };

  const _fetchQuestionIds = async () => {
    const questionIds = MOCK_QUESTIONS.map((q) => q.index.toString());
    return questionIds;
  };

  const getQuestionCount = () => {
    return Object.keys(answerState).length;
  };

  return (
    <TestContext.Provider
      value={{
        errors,
        answerState,
        setErrors,
        saveResponse,
        markForReview,
        clearResponse,
        submitTest,
        startTest,
        isTestStarted,
        getQuestionCount,
        testLoading,
        currentQuestion,
        goToNextQuestion,
        goToQuestion,
        showViolationScreen,
        bannedFromTest,
      }}
    >
      <div id="test-screen" ref={testScreenEl}>
        <NotifProvider>{children}</NotifProvider>
      </div>
    </TestContext.Provider>
  );
}
