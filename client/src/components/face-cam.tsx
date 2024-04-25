import { useContext, useEffect, useRef } from "react";
import { WebCamContext } from "../providers/WebCamProvider/WebCamProvider";

export default function FaceCam() {
  const { stream } = useContext(WebCamContext);
  const videoElRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (stream) {
      videoElRef.current!.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="face-cam w-44 bg-gray-900 rounded-md overflow-hidden absolute bottom-0 right-0 m-12">
      {stream ? <video ref={videoElRef} autoPlay muted /> : null}
    </div>
  );
}
