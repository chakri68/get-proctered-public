import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ViolationContext } from "../providers/ViolationProvider/ViolationProvider";
import { useParams } from "next/navigation";
import instance from "../lib/backend-connect";

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

  const [serviceStarted, setServiceStarted] = useState<boolean>(false);

  const notifRefs = useRef<string[]>([]);

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
    if (!serviceStarted) {
      return;
    }
    const newViolation = violations[violations.length - 1];
    if (newViolation) {
      instance
        .post(`/test/${testId}/analytics`, {
          code: newViolation.code,
          severity: newViolation.severity,
          timestamp: newViolation.timestamp,
          message: "You have violated the test rules",
        })
        .then((res) => {
          console.log(res.data);
        });
      notifRefs.current.push(
        addNotif({
          body: "You have violated the test rules",
          title: `Violation ${newViolation.code}`,
          type:
            newViolation.severity === "error"
              ? NotifType.ERROR
              : NotifType.WARNING,
          closeable: true,
        })
      );
      if (newViolation.severity === "error") {
        console.log({ newViolation });
        showViolationScreen();
      } else {
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
    startViolationListeners();
    setServiceStarted(true);
    makeFullscreen(el);
  };

  const stopService = () => {
    // Clear all notifications
    notifRefs.current.forEach((ref) => removeNotif(ref));
    stopViolationListeners();
    setServiceStarted(false);
  };

  return {
    startService,
    stopService,
  };
}
