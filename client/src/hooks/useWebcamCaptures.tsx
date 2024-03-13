import { useRef, useState, useEffect } from "react";

export default function useWebcamCaptures(duration: number) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenshots, setScreenshots] = useState<Blob[]>([]);

  useEffect(() => {
    const constraints = {
      audio: false,
      video: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => setStream(stream))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (stream !== null) {
      const track = stream.getVideoTracks()[0];

      // @ts-ignore
      const imageCapture = new window.ImageCapture(track);

      intervalRef.current = setInterval(() => {
        imageCapture
          .takePhoto()
          .then((blob: Blob) => {
            setScreenshots((prevState) => [...prevState, blob]);
          })
          .catch((error: Error) => {
            console.log(error);
            clearInterval(intervalRef.current ?? undefined);
          });
      }, duration);
    }

    return () => {
      clearInterval(intervalRef.current ?? undefined);
    };
  }, [stream, duration]);

  return screenshots;
}
