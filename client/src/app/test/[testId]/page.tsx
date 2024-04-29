"use client";

import { StartScreen } from "@/components/start-screen";
import { TestScreen } from "@/components/test-screen";
import ScreenProvider from "@/providers/ScreenContext/ScreenContext";
import ViolationProvider from "@/providers/ViolationProvider/ViolationProvider";
import TestProvider, {
  TestContext,
} from "@/providers/TestProvider/TestProvider";
import WebCamProvider from "@/providers/WebCamProvider/WebCamProvider";
import { Toaster } from "react-hot-toast";

export default function TestPage() {
  return (
    <>
      <ScreenProvider>
        <WebCamProvider>
          <ViolationProvider>
            <TestProvider>
              <Toaster />
              <TestContext.Consumer>
                {({ isTestStarted, testLoading }) => {
                  if (!isTestStarted && !testLoading) {
                    return (
                      <div className="w-screen h-screen grid place-items-center">
                        <StartScreen />
                      </div>
                    );
                  } else {
                    return <TestScreen />;
                  }
                }}
              </TestContext.Consumer>
            </TestProvider>
          </ViolationProvider>
        </WebCamProvider>
      </ScreenProvider>
    </>
  );
}
