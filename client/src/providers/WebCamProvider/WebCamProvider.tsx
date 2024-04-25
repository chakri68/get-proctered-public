import React, { useEffect, useState, createContext } from "react";

export const WebCamContext = createContext<{
  stream: MediaStream | null;
  screenshots: Blob[];
  duration: number | null;
  isRecording: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isMuted: boolean;
  setupWebCam: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  changeDuration: (newDuration: number) => void;
  toggleMute: () => void;
}>({
  stream: null,
  screenshots: [],
  duration: null,
  isRecording: false,
  isPaused: false,
  isStopped: false,
  isMuted: false,
  setupWebCam: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  stopRecording: () => {},
  changeDuration: (newDuration: number) => {},
  toggleMute: () => {},
});

export default function WebCamProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenshots, setScreenshots] = useState<Blob[]>([]);
  const [duration, setDuration] = useState<number | null>(null); // null if not taking screenshots
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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

  const pauseRecording = () => {
    setIsPaused(true);
    stream?.getTracks().forEach((track) => track.stop());
  };

  const resumeRecording = () => {
    setIsPaused(false);
    setupWebCam();
  };

  const stopRecording = () => {
    setIsStopped(true);
    stream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    if (stream !== null && duration !== null) {
      const track = stream.getVideoTracks()[0];

      // @ts-ignore
      const imageCapture = new window.ImageCapture(track);

      const interval = setInterval(() => {
        imageCapture
          .takePhoto()
          .then((blob: Blob) => {
            setScreenshots((prevState) => [...prevState, blob]);
          })
          .catch((error: Error) => {
            console.log(error);
            clearInterval(interval);
          });
      }, duration);

      return () => {
        clearInterval(interval);
      };
    }
  }, [stream, duration]);

  const changeDuration = (newDuration: number) => {
    setDuration(newDuration);
  };

  const toggleMute = () => {
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  return (
    <WebCamContext.Provider
      value={{
        stream,
        screenshots,
        duration,
        isRecording,
        isPaused,
        isStopped,
        isMuted,
        setupWebCam,
        pauseRecording,
        resumeRecording,
        stopRecording,
        changeDuration,
        toggleMute,
      }}
    >
      {children}
    </WebCamContext.Provider>
  );
}
