"use client";

import React, { useContext, useRef } from "react";
import Webcam from "react-webcam";
import useWebcamCaptures from "../hooks/useWebcamCaptures";
import { useEffect } from "react";
import { getDescriptors, loadModels } from "@/pipeline/Faces";
import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  const webcamRef = useRef<Webcam>(null);

  const screenshots = useWebcamCaptures(1000);
  const { addNotif, removeNotif } = useContext(NotifContext);

  const notifId = useRef<{
    id: string;
    reason: "no-face" | "multiple-faces";
  } | null>(null);

  const noFaceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const ssBlob = screenshots.pop();
    if (ssBlob) {
      const ss = new Image();
      ss.src = URL.createObjectURL(ssBlob);
      getDescriptors(ss).then((descriptor) => {
        console.log({ descriptor });
        if (descriptor.length === 1) {
          if (notifId.current) {
            removeNotif(notifId.current.id);
            notifId.current = null;
          }
          if (noFaceTimeoutRef.current) {
            clearTimeout(noFaceTimeoutRef.current);
            noFaceTimeoutRef.current = null;
          }
        } else {
          if (descriptor.length < 1) {
            if (
              notifId.current === null ||
              notifId.current.reason !== "no-face"
            ) {
              if (!noFaceTimeoutRef.current) {
                noFaceTimeoutRef.current = setTimeout(() => {
                  notifId.current = {
                    id: addNotif({
                      title: "No face detected",
                      body: "Please make sure your face is visible",
                      type: NotifType.ERROR,
                    }),
                    reason: "no-face",
                  };
                }, 10000);
              }
            }
          } else {
            if (
              notifId.current === null ||
              notifId.current.reason !== "multiple-faces"
            ) {
              notifId.current = {
                id: addNotif({
                  title: "Multiple faces detected",
                  body: "Please make sure only one face is visible",
                  type: NotifType.ERROR,
                }),
                reason: "multiple-faces",
              };
            }
          }
        }
      });
    }
  }, [screenshots]);

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <>
      <button
        onClick={() => {
          // Add all types of notifications
          Object.values(NotifType).forEach((type) => {
            addNotif({
              title: `Test${Date.now()}`,
              body: "This is a test",
              type,
              closeable: true,
              onClick: () => {
                console.log("clicked");
              },
            });
          });
        }}
      >
        CLICK
      </button>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        className="absolute top-0 left-0 w-[20rem]"
      />
    </>
  );
};

export default WebcamCapture;
