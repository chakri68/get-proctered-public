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
  const webcamRef = useRef<HTMLDivElement>(null);

  const screenshots = useWebcamCaptures(1000);
  const { addNotif, removeNotif } = useContext(NotifContext);
  // const { position, onMouseDown } = useDrag(webcamRef);

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
                }, 3000);
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
      {/* <button
        onClick={() => {
          // Add all types of notifications
          Object.values(NotifType).forEach((type, idx) => {
            addNotif({
              title: `Test${Date.now()}`,
              body: "This is a test",
              type,
              closeable: true,
              timeout: idx % 2 === 0 ? 6000 : undefined,
            });
          });
        }}
      >
        CLICK
      </button> */}
      <div
        className="w-[10rem] rounded-xl cursor-pointer webcam-wrapper overflow-hidden"
        // onMouseDown={onMouseDown}
        onClick={(ev) => {
          if (ev.currentTarget.style.width === "17rem")
            ev.currentTarget.style.width = "10rem";
          else ev.currentTarget.style.width = "17rem";
        }}
        style={{
          position: "absolute",
          bottom: "75px",
          right: "20px",
          transition: "width 0.5s",
        }}
        ref={webcamRef}
      >
        <Webcam
          audio={false}
          height={720}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
        />
      </div>
    </>
  );
};

export default WebcamCapture;
