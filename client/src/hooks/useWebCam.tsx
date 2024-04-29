import React, { useContext, useState } from "react";
import { WebCamContext } from "../providers/WebCamProvider/WebCamProvider";
import {
  FilesetResolver,
  ObjectDetector,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";
import { TestContext } from "@/providers/TestProvider/TestProvider";

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

export default function useWebCam({
  showWarningScreen,
  showViolationScreen,
}: {
  showWarningScreen: () => void;
  showViolationScreen: () => void;
}) {
  const { videoElRef } = useContext(WebCamContext);

  const [serviceStarted, setServiceStarted] = useState<boolean>(false);
  const objectDetector = React.useRef<ObjectDetector | null>(null);
  const faceLandmarker = React.useRef<FaceLandmarker | null>(null);
  const previousTime = React.useRef<number>(-1);
  const animationRef = React.useRef<number>();

  const violationCount = React.useRef<number>(0);

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
    predictionJob();
    setServiceStarted(true);
  };

  const checkPredictions = (predictions: Detection[]) => {
    const numPeople = predictions.reduce((acc, prediction) => {
      return (
        acc +
        prediction.categories.filter(
          (category) => category.categoryName === "person"
        ).length
      );
    }, 0);
    if (numPeople !== 1) {
      violationCount.current += 1;
      // Start a timer to listen if the user is still violating the rule
    }
    predictions.forEach((prediction) => {
      if (
        prediction.categories.some((category) =>
          BANNED_CATEGORIES.includes(category.categoryName)
        )
      ) {
        violationCount.current += 1;
      }
    });

    if (violationCount.current > 5) {
      showWarningScreen();
      violationCount.current = 0;
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

  const predictionJob = async () => {
    const startTime = performance.now();
    const video = videoElRef.current;
    if (video) {
      if (video.currentTime !== previousTime.current) {
        previousTime.current = video.currentTime;
        const predictions = objectDetector.current?.detectForVideo(
          video,
          startTime
        );
        // const facePredictions = faceLandmarker.current?.detectForVideo(
        //   video,
        //   startTime
        // );
        // if (!predictions || !facePredictions) {
        if (!predictions) {
          violationCount.current += 1;
        }
        if (predictions) {
          checkPredictions(predictions.detections);
        }
        // if (facePredictions) {
        //   checkFacePredictions(facePredictions);
        // }
      }
    }

    animationRef.current = window.requestAnimationFrame(predictionJob);
  };

  const stopService = () => {
    window.cancelAnimationFrame(animationRef.current!);
    setServiceStarted(false);
  };

  return {
    startWebCamService: startService,
    stopWebCamService: stopService,
    serviceStarted,
  };
}
