"use client";

import { StartScreen } from "@/components/start-screen";
import { TestScreen } from "@/components/test-screen";
import ScreenProvider from "@/providers/ScreenContext/ScreenContext";
import TestProvider, {
  TestContext,
} from "@/providers/TestProvider/TestProvider";
import WebCamProvider from "@/providers/WebCamProvider/WebCamProvider";

export default function TestPage() {
  return (
    <ScreenProvider>
      <WebCamProvider>
        <TestProvider>
          <TestContext.Consumer>
            {({ isTestStarted, testLoading }) => {
              if (!isTestStarted && !testLoading) {
                return (
                  <div className="w-screen h-screen grid place-items-center">
                    <div className="w-96">
                      <StartScreen />
                    </div>
                  </div>
                );
              } else {
                return <TestScreen />;
              }
            }}
          </TestContext.Consumer>
        </TestProvider>
      </WebCamProvider>
    </ScreenProvider>
  );
}
