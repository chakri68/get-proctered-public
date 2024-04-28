import {
  createContext,
  useContext,
  useState,
  createRef,
  useEffect,
} from "react";
import { WebCamContext } from "@/providers/WebCamProvider/WebCamProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import useTestAnalytics from "@/hooks/useTestAnalytics";
import NotifContext, {
  NotifProvider,
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";
import instance from "@/lib/backend-connect";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";

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

export const TestContext = createContext<{
  answerState: AnswerState[];
  saveResponse: (questionId: string, optionId: string) => Promise<void>;
  markForReview: (questionId: string, optionId: string | null) => Promise<void>;
  clearResponse: (questionId: string) => Promise<void>;
  submitTest: () => Promise<void>;
  startTest: () => Promise<void>;
  isTestStarted: boolean;
  getQuestionCount: () => number;
  testLoading: boolean;
  currentQuestion: Question;
  goToNextQuestion: () => Promise<void>;
  goToQuestion: (questionId: string) => Promise<void>;
  showViolationScreen: () => void;
  showWarningScreen: () => void;
  bannedFromTest: boolean;
  warningScreen: boolean;
  continueFromWarning: () => void;
  testEnd: boolean;
}>({
  answerState: [],
  saveResponse: () => new Promise(() => {}),
  markForReview: () => new Promise(() => {}),
  clearResponse: () => new Promise(() => {}),
  submitTest: () => new Promise(() => {}),
  startTest: () => new Promise(() => {}),
  isTestStarted: false,
  getQuestionCount: () => 0,
  testLoading: false,
  currentQuestion: {
    id: "",
    question: "",
    options: [],
  },
  goToNextQuestion: () => new Promise(() => {}),
  goToQuestion: () => new Promise(() => {}),
  showViolationScreen: () => {},
  showWarningScreen: () => {},
  bannedFromTest: false,
  warningScreen: false,
  continueFromWarning: () => {},
  testEnd: false,
});

export default function TestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { testId } = useParams();
  const { getSnapshot } = useContext(WebCamContext);
  const { exitFullscreen } = useContext(ScreenContext);

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
  const [warningScreen, setWarningScreen] = useState<boolean>(false);

  const { addNotif } = useContext(NotifContext);

  const testScreenEl = createRef<HTMLDivElement>();

  const showViolationScreen = () => {
    setBannedFromTest(true);
    instance.get(`/test/${testId}/end-test`).then((res) => {
      console.log(res);
      addNotif({
        type: NotifType.ERROR,
        title: "Test Ended",
        body: "You have been banned from the test.",
      });
      setTestEnd(true);
      exitFullscreen();
    });
  };

  const showWarningScreen = () => {
    setWarningScreen(true);
  };

  const { startService, stopService } = useTestAnalytics({
    showViolationScreen,
    showWarningScreen,
  });

  const goToNextQuestion = async () => {
    const nextQuestionId =
      answerState.findIndex((ans) => ans.questionId === currentQuestion.id) + 1;
    if (nextQuestionId >= answerState.length) {
      return;
    }

    await _fetchQuestion(answerState[nextQuestionId].questionId);
  };

  const goToQuestion = async (questionId: string) => {
    await _fetchQuestion(questionId);
  };

  const saveResponse = async (questionId: string, optionId: string) => {
    await instance.post(`/test/${testId}/submit-answer`, {
      answer: { questionId, optionId },
    });
    setAnswerState((prev) => {
      const n = [...prev];
      const ans = n.find((ans) => ans.questionId === questionId)!;
      ans.status = QuestionStatus.SAVED;
      ans.optionId = optionId;
      return n;
    });
    goToNextQuestion();
  };

  const markForReview = async (questionId: string, optionId: string | null) => {
    await instance.post(`/test/${testId}/submit-answer`, {
      answer: { questionId, optionId },
    });
    setAnswerState((prev) => {
      const n = [...prev];
      const ans = n.find((ans) => ans.questionId === questionId)!;
      ans.status = QuestionStatus.MARKED_FOR_REVIEW;
      ans.optionId = optionId;
      return n;
    });
    goToNextQuestion();
  };

  const clearResponse = async (questionId: string) => {
    await instance.post(`/test/${testId}/submit-answer`, {
      answer: { questionId, optionId: null },
    });
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

    // Start the session
    const formData = new FormData();
    const snapshot = await getSnapshot();
    console.log({ snapshot });
    formData.append("face", snapshot);

    try {
      const res = await instance.post(`/test/${testId}/start-test`, formData);
      console.log(res);
    } catch (e) {
      console.error(e);
      stopService();
      exitFullscreen();
      if (e instanceof AxiosError) {
        addNotif({
          type: NotifType.ERROR,
          title: "Error starting test.",
          body:
            e.response?.data.error ??
            e.response?.data.message ??
            "An unknown error occurred.",
        });
      } else {
        addNotif({
          type: NotifType.ERROR,
          title: "Error starting test.",
          body: "An unknown error occurred.",
        });
      }
      setTestLoading(false);
      return;
    }

    // Fetch question ids
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

  const submitTest = async () => {
    setTestLoading(true);
    await instance.get(`/test/${testId}/end-test`);
    setTestLoading(false);
    stopService();
    exitFullscreen();
    setTestEnd(true);
  };

  const _fetchQuestion = async (questionId: string) => {
    // Fetch question data
    const res = await instance.get(`/test/${testId}`);
    const q = res.data.data.questions as Question[];
    const questionIds = q.map((q) => q.id.toString());
    const question = q.find((q) => q.id.toString() === questionId)!;
    setCurrentQuestion({
      id: questionId,
      question: question.question,
      options: question.options.map((option, index) => ({
        id: index.toString(),
        text: option.text,
      })),
    });
  };

  const _fetchQuestionIds = async () => {
    const res = await instance.get(`/test/${testId}`);
    const q = res.data.data.questions as Question[];
    const questionIds = q.map((q) => q.id.toString());
    return questionIds;
  };

  const getQuestionCount = () => {
    return Object.keys(answerState).length;
  };

  const handleWarningClose = () => {
    startService(testScreenEl.current!);
    setWarningScreen(false);
  };

  return (
    <TestContext.Provider
      value={{
        answerState,
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
        showWarningScreen,
        bannedFromTest,
        warningScreen,
        continueFromWarning: handleWarningClose,
        testEnd,
      }}
    >
      <div id="test-screen" ref={testScreenEl}>
        <NotifProvider>{children}</NotifProvider>
      </div>
    </TestContext.Provider>
  );
}
