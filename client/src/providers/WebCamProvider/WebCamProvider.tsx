import React, { useEffect, useState, createContext } from "react";

export const WebCamContext = createContext<{
  stream: MediaStream | null;
  setupWebCam: () => void;
  getSnapshot: () => Promise<Blob>;
  isRecording: boolean;
  resumeRecording: () => void;
}>({
  stream: null,
  setupWebCam: () => {},
  getSnapshot: () =>
    new Promise(() => {
      return new Blob();
    }),
  isRecording: false,
  resumeRecording: () => {},
});

export default function WebCamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const setupWebCam = () => {
    const constraints = {
      audio: false,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setStream(stream);
        setIsRecording(true);
      })
      .catch((error) => console.log(error));
  };

  const getSnapshot = async () => {
    // @ts-ignore
    const imageCapture = new ImageCapture(stream?.getVideoTracks()[0]);
    const blob = await imageCapture.takePhoto();
    return blob;
  };

  const resumeRecording = () => {
    setupWebCam();
  };

  return (
    <WebCamContext.Provider
      value={{
        stream,
        setupWebCam,
        getSnapshot,
        isRecording,
        resumeRecording,
      }}
    >
      {children}
    </WebCamContext.Provider>
  );
}