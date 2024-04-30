/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/SNI7uHfKnDQ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Button } from "@/components/ui/button";
import {
  Question,
  QuestionStatus,
  TestContext,
} from "@/providers/TestProvider/TestProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { TestSkeletonScreen } from "./test-skeleton-screen";
import { TestViolationScreen } from "./test-violation-screen";
import WebcamCapture from "./WebCam";
import { formatDuration } from "@/lib/date";
import { ViolationContext } from "@/providers/ViolationProvider/ViolationProvider";
import toast from "react-hot-toast";

export function TestScreen() {
  const {
    testLoading,
    answerState,
    currentQuestion,
    goToQuestion,
    bannedFromTest,
    warningScreen,
    continueFromWarning,
    submitTest,
    testEnd,
    testDetails,
  } = useContext(TestContext);

  const { violations } = useContext(ViolationContext);

  const [fullLoad, setFullLoad] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeRemainingElRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (testDetails) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        // testDetails.duration is in mins
        const remainingTime = testDetails.endTime.getTime() - Date.now();
        if (remainingTime < 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          toast.promise(submitTest(), {
            loading: "Submitting Test...",
            success: "Test Submitted",
            error: "Failed to submit test",
          });
        }
        if (timeRemainingElRef.current) {
          timeRemainingElRef.current.innerText = formatDuration(remainingTime);
        }
      }, 1000);
    }
  }, [testDetails]);

  if (testLoading) return <TestSkeletonScreen />;
  if (bannedFromTest) return <TestViolationScreen />;
  if (warningScreen) {
    return (
      <div className="flex h-screen w-full">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 flex flex-col gap-6 rounded-md w-full">
          <div className="flex-1 grid place-items-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow w-[32rem] m-auto">
              <div className="text-lg font-semibold mb-4">
                You have been warned
              </div>
              <div className="mb-4">
                You have been warned for violating the test rules. You can
                continue the test but your actions will be recorded.
              </div>
              {/* Show the last recorded violation */}
              {violations.length > 0 && (
                <div className="mb-4">
                  <div className="font-semibold">Last Violation:</div>
                  <div>{violations[violations.length - 1].code}</div>
                </div>
              )}
              <Button
                onClick={() => {
                  continueFromWarning();
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (testEnd) {
    return (
      <div className="flex h-screen w-full">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 flex flex-col gap-6 rounded-md w-full">
          <div className="flex-1 grid place-items-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow w-[32rem] m-auto">
              <div className="text-lg font-semibold mb-4">Test Ended</div>
              <div className="mb-4">
                You have successfully completed the test. Your responses have
                been recorded.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentQuestion = (questionNum: string) => (
    <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-50">
      {questionNum}
    </div>
  );

  const renderUnVisitedQuestion = (questionNum: string) => (
    <div
      className="bg-gray-200 dark:bg-gray-700 px-3 py-1 cursor-pointer rounded-full text-sm font-medium text-gray-500 dark:text-gray-400"
      onClick={async () => {
        setFullLoad(true);
        await goToQuestion(questionNum);
        setFullLoad(false);
      }}
    >
      {questionNum}
    </div>
  );

  const renderAnsweredQuestion = (questionNum: string) => (
    // Green bg for answered questions
    <div
      className="bg-green-500 dark:bg-green-400 px-3 py-1 cursor-pointer rounded-full text-sm font-medium text-white dark:text-gray-400"
      onClick={async () => {
        setFullLoad(true);
        goToQuestion(questionNum);
        setFullLoad(false);
      }}
    >
      {questionNum}
    </div>
  );

  const renderMarkedQuestion = (questionNum: string) => (
    // Purple bg for marked questions
    <div
      className="bg-purple-500 dark:bg-purple-400 px-3 py-1 cursor-pointer rounded-full text-sm font-medium text-white dark:text-gray-400"
      onClick={async () => {
        setFullLoad(true);
        goToQuestion(questionNum);
        setFullLoad(false);
      }}
    >
      {questionNum}
    </div>
  );

  return (
    <div className="flex h-screen w-full">
      <div className="bg-gray-100 dark:bg-gray-800 p-6 flex flex-col gap-6 rounded-md w-full">
        <div className="flex items-center justify-between">
          {testDetails && (
            <div className="text-lg font-semibold">
              Time Remaining: <span ref={timeRemainingElRef}></span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {/* <Button size="sm" variant="outline">
              <ClockIcon className="w-4 h-4 mr-2" />
              Pause
            </Button> */}
            <Button
              size="sm"
              variant="outline"
              onClick={async () => {
                setFullLoad(true);
                await submitTest();
                setFullLoad(false);
              }}
            >
              <XIcon className="w-4 h-4 mr-2" />
              End Test
            </Button>
          </div>
        </div>
        <div className="flex-1 grid place-items-center">
          <div className="grid gap-4">
            <div className="flex gap-2 max-w-[32rem] overflow-x-auto m-auto pb-4 px-4">
              {answerState.map(({ questionId, status }) => {
                if (questionId === currentQuestion.id) {
                  return renderCurrentQuestion(questionId);
                }
                if (status === QuestionStatus.SAVED) {
                  return renderAnsweredQuestion(questionId);
                } else if (status === QuestionStatus.MARKED_FOR_REVIEW) {
                  return renderMarkedQuestion(questionId);
                } else {
                  return renderUnVisitedQuestion(questionId);
                }
              })}
            </div>

            {fullLoad ? (
              <TestSkeletonScreen className="shadow-sm bg-gray-200 rounded-md w-[32rem]" />
            ) : (
              <QuestionCard />
            )}
            <WebcamCapture />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionCard() {
  const {
    currentQuestion,
    markForReview,
    saveResponse,
    clearResponse,
    answerState,
    goToNextQuestion,
  } = useContext(TestContext);

  const [nextLoading, setNextLoading] = useState(false);
  const [markedForReviewLoading, setMarkedForReviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(
    answerState.find((ans) => ans.questionId === currentQuestion.id)
      ?.optionId ?? null
  );

  useEffect(() => {
    setSelectedOption(
      answerState.find((ans) => ans.questionId === currentQuestion.id)
        ?.optionId ?? null
    );
  }, [currentQuestion, answerState]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow w-[32rem] m-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">
          Question {currentQuestion.id}
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-50">
            {currentQuestion.type}
          </div>
          <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-50">
            {currentQuestion.marks} Marks
          </div>
        </div>
      </div>
      <div className="mb-4">{currentQuestion.question}</div>
      <div className="grid gap-2">
        {currentQuestion.options.map((opt) => (
          <Button
            variant="outline"
            style={{
              ...(selectedOption === opt.id
                ? { backgroundColor: "rgba(0, 0, 0)", color: "white" }
                : {
                    backgroundColor: "transparent",
                    color: "rgba(0, 0, 0)",
                  }),
            }}
            key={opt.id}
            onClick={() => {
              if (selectedOption === opt.id) {
                setSelectedOption(null);
                return;
              }
              setSelectedOption(opt.id);
            }}
          >
            {opt.option}
          </Button>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          loading={nextLoading}
          disabled={nextLoading}
          onClick={async () => {
            setNextLoading(true);
            await goToNextQuestion();
            setNextLoading(false);
          }}
        >
          <ArrowRightIcon className="w-4 h-4 mr-2" />
          Next
        </Button>
        <Button
          variant="outline"
          loading={markedForReviewLoading}
          onClick={async () => {
            setMarkedForReviewLoading(true);
            await markForReview(currentQuestion.id, selectedOption);
            setMarkedForReviewLoading(false);
          }}
        >
          <FlagIcon className="w-4 h-4 mr-2" />
          Mark for Review
        </Button>

        <Button
          disabled={!selectedOption}
          loading={saveLoading}
          onClick={async () => {
            setSaveLoading(true);
            await saveResponse(currentQuestion.id, selectedOption!);
            setSaveLoading(false);
          }}
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FlagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
