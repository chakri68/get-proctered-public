import { forwardRef, useContext, useEffect, useRef } from "react";
import { WebCamContext } from "../providers/WebCamProvider/WebCamProvider";

export default forwardRef<HTMLVideoElement, {}>(function FaceCam(props, ref) {
  const { stream } = useContext(WebCamContext);

  useEffect(() => {
    if (stream) {
      // @ts-ignore
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="face-cam w-44 bg-gray-900 rounded-md overflow-hidden absolute bottom-0 right-0 m-12">
      {stream ? <video ref={ref} autoPlay muted /> : null}
    </div>
  );
});
