import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import { Error, ErrorCode } from "@/providers/TestProvider/TestProvider";
import { WebCamContext } from "@/providers/WebCamProvider/WebCamProvider";
import { useContext, useEffect, useRef, useState } from "react";

export default function useTestAnalytics({
  onError,
  showViolationScreen,
}: {
  onError: (error: Error) => void;
  showViolationScreen: () => void;
}) {
  const { isRecording } = useContext(WebCamContext);
  const { isFullScreen, makeFullscreen } = useContext(ScreenContext);
  const { addNotif, notifs, removeNotif } = useContext(NotifContext);

  const fullScreenExitNotifRef = useRef<string | null>(null);
  const fullScreenCount = useRef<number>(0);

  const [serviceStarted, setServiceStarted] = useState<boolean>(false);

  useEffect(() => {
    if (serviceStarted) {
      addNotif({
        body: "Service started",
        title: "Test Analytics",
        type: NotifType.INFO,
        closeable: true,
        timeout: 5000,
      });
    }
  }, [serviceStarted]);

  useEffect(() => {
    if (!serviceStarted) return;
    if (!isRecording) {
      onError({
        code: ErrorCode.RECORDING_STOPPED,
        message: "Recording stopped unexpectedly",
      });
    }
  }, [isRecording]);

  useEffect(() => {
    if (!serviceStarted) return;
    if (!isFullScreen) {
      fullScreenCount.current++;
      if (fullScreenCount.current > 0) {
        showViolationScreen();
      }
      if (fullScreenExitNotifRef.current === null) {
        fullScreenExitNotifRef.current = addNotif({
          body: "Exited fullscreen unexpectedly",
          title: "Test Analytics",
          type: NotifType.ERROR,
          closeable: false,
        });
      } else {
        removeNotif(fullScreenExitNotifRef.current);
        fullScreenExitNotifRef.current = addNotif({
          body: "Exited fullscreen unexpectedly",
          title: "Test Analytics",
          type: NotifType.ERROR,
          closeable: false,
        });
      }
      onError({
        code: ErrorCode.FULLSCREEN_EXIT,
        message: "Exited fullscreen unexpectedly",
      });
    } else {
      if (fullScreenExitNotifRef.current)
        removeNotif(fullScreenExitNotifRef.current);
    }
  }, [isFullScreen]);

  const startService = (el: HTMLElement) => {
    setServiceStarted(true);
    makeFullscreen(el);
  };

  return {
    startService,
  };
}
