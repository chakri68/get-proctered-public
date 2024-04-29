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
import toast from "react-hot-toast";

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
  option: string;
  isCorrect: boolean;
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
  registered: { email: string; name: string } | null;
  registerUser: (email: string, name: string) => void;
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
  registered: null,
  registerUser: () => {},
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
  const [registered, setRegistered] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const { addNotif } = useContext(NotifContext);

  const testScreenEl = createRef<HTMLDivElement>();

  const showViolationScreen = () => {
    stopService();
    setBannedFromTest(true);
    instance
      .post(`/test/${testId}/end-test`, {
        reason: "SUSPENDED",
      })
      .then((res) => {
        console.log(res);
        setTestEnd(true);
        exitFullscreen();
      });
  };

  const showWarningScreen = () => {
    setWarningScreen(true);
    stopService();
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
    formData.append("face", snapshot);

    try {
      const res = await instance.post(`/test/${testId}/start-test`, formData);
      console.log(res);
    } catch (e) {
      console.error(e);
      stopService();
      exitFullscreen();
      if (e instanceof AxiosError) {
        toast.error(
          "Error starting the test. \n" + `${e.response?.data.message}`
        );
      } else {
        toast.error("Error starting the test.");
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
    await instance.post(`/test/${testId}/end-test`, {
      reason: "COMPLETED",
    });
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
      options: question.options.map((option) => ({
        id: option.id,
        option: option.option,
        isCorrect: option.isCorrect,
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
        registered,
        registerUser: (email: string, name: string) => {
          setRegistered({ email, name });
        },
      }}
    >
      <div id="test-screen" ref={testScreenEl}>
        <NotifProvider>{children}</NotifProvider>
      </div>
    </TestContext.Provider>
  );
}
