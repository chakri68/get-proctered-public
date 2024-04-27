import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";
import { ScreenContext } from "@/providers/ScreenContext/ScreenContext";
import { useContext, useEffect, useRef, useState } from "react";
import { ViolationContext } from "../providers/ViolationProvider/ViolationProvider";

export default function useTestAnalytics({
  showViolationScreen,
  showWarningScreen,
}: {
  showViolationScreen: () => void;
  showWarningScreen: () => void;
}) {
  const { violations } = useContext(ViolationContext);

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
    const newViolation = violations[violations.length - 1];
    if (newViolation) {
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
    setServiceStarted(true);
    makeFullscreen(el);
  };

  return {
    startService,
  };
}
