"use client";

import React from "react";
import Webcam from "react-webcam";
const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const WebcamCapture = () => {
  return (
    <>
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
        // ref={webcamRef}
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
