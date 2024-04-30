import React, { useContext, useEffect, useState } from "react";
import { WebCamContext } from "../providers/WebCamProvider/WebCamProvider";
import {
  FilesetResolver,
  ObjectDetector,
  FaceLandmarker,
  FaceDetector,
} from "@mediapipe/tasks-vision";
import { ViolationContext } from "@/providers/ViolationProvider/ViolationProvider";

export interface Detection {
  categories: Category[];
  keypoints: any[];
  boundingBox?: BoundingBox;
}

export interface Category {
  score: number;
  index: number;
  categoryName: string;
  displayName: string;
}

export interface BoundingBox {
  originX: number;
  originY: number;
  width: number;
  height: number;
  angle: number;
}

const BANNED_CATEGORIES = ["cell phone"];

export default function useWebCam() {
  const { videoElRef, stream } = useContext(WebCamContext);
  const { addViolation } = useContext(ViolationContext);

  const [serviceStarted, setServiceStarted] = useState<boolean>(false);
  const objectDetector = React.useRef<ObjectDetector | null>(null);
  const faceLandmarker = React.useRef<FaceLandmarker | null>(null);
  const faceDetector = React.useRef<FaceDetector | null>(null);
  const previousTime = React.useRef<number>(-1);
  const animationRef = React.useRef<number>();

  const warningsRef = React.useRef<{
    TOO_MANY_FACES: number;
    FACE_NOT_FOUND: number;
    PHONE_DETECTED: number;
  }>({
    TOO_MANY_FACES: 0,
    FACE_NOT_FOUND: 0,
    PHONE_DETECTED: 0,
  });

  const violationCount = React.useRef<{
    TOO_MANY_FACES: number;
    FACE_NOT_FOUND: number;
    PHONE_DETECTED: number;
  }>({
    TOO_MANY_FACES: 0,
    FACE_NOT_FOUND: 0,
    PHONE_DETECTED: 0,
  });

  const startService = async () => {
    const vision = await FilesetResolver.forVisionTasks(
      // path/to/wasm/root
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );
    objectDetector.current = await ObjectDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-tasks/object_detector/efficientdet_lite0_uint8.tflite`,
      },
      scoreThreshold: 0.5,
      runningMode: "VIDEO",
    });
    // const filesetResolver = await FilesetResolver.forVisionTasks(
    //   "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
    // );
    // faceLandmarker.current = await FaceLandmarker.createFromOptions(
    //   filesetResolver,
    //   {
    //     baseOptions: {
    //       modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
    //       delegate: "GPU",
    //     },
    //     outputFaceBlendshapes: true,
    //     runningMode: "VIDEO",
    //     numFaces: 1,
    //   }
    // );
    faceDetector.current = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
    });
    setServiceStarted(true);
  };

  useEffect(() => {
    if (!serviceStarted) {
      console.log("Service stopped");
      return;
    }
    if (objectDetector.current && faceDetector.current) {
      console.log("Service already started");
      predictionJob();
      return;
    }
    predictionJob();
  }, [serviceStarted]);

  const checkPredictions = (predictions: Detection[]) => {
    predictions.forEach((prediction) => {
      if (
        prediction.categories.some((category) =>
          BANNED_CATEGORIES.includes(category.categoryName)
        )
      ) {
        console.log("Phone detected", violationCount.current);
        violationCount.current.PHONE_DETECTED += 1;
        if (violationCount.current.PHONE_DETECTED > 20) {
          if (warningsRef.current.PHONE_DETECTED > 2) {
            // @ts-ignore
            new ImageCapture(stream.getVideoTracks()[0])
              .takePhoto()
              .then((blob: Blob) => {
                addViolation({
                  code: "PHONE_DETECTED",
                  severity: "error",
                  timestamp: new Date(),
                  snapshot: blob,
                });
              });
            warningsRef.current.PHONE_DETECTED = 0;
          } else {
            warningsRef.current.PHONE_DETECTED += 1;
            // @ts-ignore
            new ImageCapture(stream.getVideoTracks()[0])
              .takePhoto()
              .then((blob: Blob) => {
                addViolation({
                  code: "PHONE_DETECTED",
                  severity: "warning",
                  timestamp: new Date(),
                  // @ts-ignore
                  snapshot: blob,
                });
              });
          }
          violationCount.current.PHONE_DETECTED = 0;
        }
      }
    });
  };

  const checkFaceDetections = (predictions: Detection[]) => {
    if (predictions.length === 0) {
      console.log("Face not found", violationCount.current);
      violationCount.current.FACE_NOT_FOUND += 1;
      if (violationCount.current.FACE_NOT_FOUND > 10) {
        if (warningsRef.current.FACE_NOT_FOUND > 2) {
          // @ts-ignore
          new ImageCapture(stream.getVideoTracks()[0])
            .takePhoto()
            .then((blob: Blob) => {
              addViolation({
                code: "FACE_NOT_FOUND",
                severity: "error",
                timestamp: new Date(),
                snapshot: blob,
              });
            });
          warningsRef.current.FACE_NOT_FOUND = 0;
        } else {
          warningsRef.current.FACE_NOT_FOUND += 1;
          // @ts-ignore
          new ImageCapture(stream.getVideoTracks()[0])
            .takePhoto()
            .then((blob: Blob) => {
              addViolation({
                code: "FACE_NOT_FOUND",
                severity: "warning",
                timestamp: new Date(),
                // @ts-ignore
                snapshot: blob,
              });
            });
        }
        violationCount.current.FACE_NOT_FOUND = 0;
      }
    }
    if (predictions.length > 1) {
      console.log("Too many faces", violationCount.current);
      violationCount.current.TOO_MANY_FACES += 1;
      if (violationCount.current.TOO_MANY_FACES > 20) {
        if (warningsRef.current.TOO_MANY_FACES > 2) {
          // @ts-ignore
          new ImageCapture(stream.getVideoTracks()[0])
            .takePhoto()
            .then((blob: Blob) => {
              addViolation({
                code: "TOO_MANY_FACES",
                severity: "error",
                timestamp: new Date(),
                snapshot: blob,
              });
            });
          warningsRef.current.TOO_MANY_FACES = 0;
        } else {
          warningsRef.current.TOO_MANY_FACES += 1;
          // @ts-ignore
          new ImageCapture(stream.getVideoTracks()[0])
            .takePhoto()
            .then((blob: Blob) => {
              addViolation({
                code: "TOO_MANY_FACES",
                severity: "warning",
                timestamp: new Date(),
                snapshot: blob,
              });
            });
        }
        violationCount.current.TOO_MANY_FACES = 0;
      }
    }
  };

  const checkFacePredictions = (predictions: any) => {
    const { faceLandmarks, faceBlendshapes } = predictions;
    // Assuming blendshapes structure from your example data

    const eyeLookOutLeft = faceBlendshapes[0].categories.find(
      (c: any) => c.categoryName === "eyeLookOutRight"
    ).score;
    const eyeLookOutRight = faceBlendshapes[0].categories.find(
      (c: any) => c.categoryName === "eyeLookOutLeft"
    ).score;

    // Set thresholds for determining the strength of looking to the side
    const sideGazeThreshold = 0.1; // Adjust this value based on your needs

    if (
      eyeLookOutRight > sideGazeThreshold &&
      eyeLookOutRight > eyeLookOutLeft
    ) {
      console.log("Looking Right");
    } else if (
      eyeLookOutLeft > sideGazeThreshold &&
      eyeLookOutLeft > eyeLookOutRight
    ) {
      console.log("Looking Left");
    } else {
      console.log("Looking Straight");
    }
  };

  const predictionJob = () => {
    const startTime = performance.now();
    const video = videoElRef.current;
    if (video) {
      if (video.currentTime !== previousTime.current) {
        previousTime.current = video.currentTime;
        const predictions = objectDetector.current?.detectForVideo(
          video,
          startTime
        );
        const fd = faceDetector.current?.detectForVideo(video, startTime);
        if (fd) {
          checkFaceDetections(fd.detections);
        }
        if (predictions) {
          checkPredictions(predictions.detections);
        }
      }
    }

    animationRef.current = window.requestAnimationFrame(predictionJob);
  };

  const stopService = () => {
    setServiceStarted(false);
    window.cancelAnimationFrame(animationRef.current!);
  };

  return {
    startWebCamService: startService,
    stopWebCamService: stopService,
    serviceStarted,
  };
}
