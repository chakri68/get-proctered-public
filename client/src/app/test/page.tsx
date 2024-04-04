"use client";

import WebcamCapture from "@/components/WebCam";
import useTestAnalytics from "@/hooks/TestAnalytics/useTestAnalytics";

export default function TestPage() {
  const { makeFullscreen } = useTestAnalytics();

  return (
    <>
      <button onClick={makeFullscreen}>full screen</button>
      <WebcamCapture />
    </>
  );
}
