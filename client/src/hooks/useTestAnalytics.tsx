import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ViolationContext } from "../providers/ViolationProvider/ViolationProvider";
import { useParams } from "next/navigation";
import instance from "../lib/backend-connect";
import { WebCamContext } from "@/providers/WebCamProvider/WebCamProvider";
import useWebCam from "./useWebCam";
import toast from "react-hot-toast";

export default function useTestAnalytics({
  showViolationScreen,
  showWarningScreen,
}: {
  showViolationScreen: () => void;
  showWarningScreen: () => void;
}) {
  const { testId } = useParams();

  const {
    violations,
    serviceStarted: violationServiceStarted,
    startService: startViolationListeners,
    stopService: stopViolationListeners,
  } = useContext(ViolationContext);

  const { makeFullscreen } = useContext(ScreenContext);
  const { addNotif, notifs, removeNotif } = useContext(NotifContext);
  const { getSnapshot } = useContext(WebCamContext);

  const { startWebCamService, stopWebCamService } = useWebCam();

  const [serviceStarted, setServiceStarted] = useState<boolean>(false);

  const notifRefs = useRef<string[]>([]);

  useEffect(() => {
    if (serviceStarted) {
      toast.success("Service started");
    }
  }, [serviceStarted]);

  useEffect(() => {
    if (!serviceStarted) {
      return;
    }
    const newViolation = violations[violations.length - 1];
    if (newViolation) {
      const fd = new FormData();
      fd.append("code", newViolation.code);
      fd.append("severity", newViolation.severity);
      fd.append("timestamp", newViolation.timestamp.toISOString());
      fd.append("message", "You have violated the test rules");
      console.log;
      if (newViolation.snapshot) fd.append("snap", newViolation.snapshot);

      instance.post(`/test/${testId}/analytics`, fd).then((res) => {
        console.log(res.data);
      });
      if (newViolation.severity === "error") {
        toast.error(`Violation: ${newViolation.code}`);
        showViolationScreen();
      } else {
        toast(
          `Warning: You have violated the test rules - ${newViolation.code}`
        );
        showWarningScreen();
      }
    }
  }, [violations]);

  const startService = (el: HTMLElement) => {
    if (serviceStarted) {
      // Clear all notifications
      notifRefs.current.forEach((ref) => removeNotif(ref));
      // Check the last violation
      const lastViolation = violations[violations.length - 1];
      if (lastViolation && lastViolation.code === "FULLSCREEN_CLOSE") {
        makeFullscreen(el);
      }
      return;
    }
    startWebCamService();
    startViolationListeners();
    setServiceStarted(true);
    makeFullscreen(el);
  };

  const stopService = () => {
    // Clear all notifications
    notifRefs.current.forEach((ref) => removeNotif(ref));
    stopWebCamService();
    stopViolationListeners();
    setServiceStarted(false);
  };

  return {
    startService,
    stopService,
  };
}
