import React, { useContext, useEffect } from "react";
import { Flag, FlagCode } from "./types";
import useWindowState from "./useWindowState";
import NotifContext, {
  NotifType,
} from "@/providers/NotifProvider/NotifProvider";

export default function useTestAnalytics() {
  const [flags, setFlags] = React.useState<Flag[]>([]);

  const { isFullscreen, isVisible, makeFullscreen } = useWindowState();
  const { addNotif, removeNotif } = useContext(NotifContext);

  const tabChangeNotifRef = React.useRef<string | null>(null);
  const fullscreenNotifRef = React.useRef<string | null>(null);

  const addFlag = (code: FlagCode, data: any) => {
    const id = Math.random().toString(36).substring(2);
    const timestamp = Date.now();
    setFlags((flags) => [
      ...flags,
      {
        id,
        code,
        timestamp,
        data,
      },
    ]);

    return id;
  };

  const removeFlag = (id: string) => {
    setFlags((flags) => flags.filter((flag) => flag.id !== id));
  };

  const generateReport = () => {
    console.log("Generating report...");
    console.log(flags);
  };

  useEffect(() => {
    if (!isVisible) {
      if (!tabChangeNotifRef.current) {
        tabChangeNotifRef.current = addNotif({
          title: "Tab Change",
          body: "You have switched tabs. The admin has been notified.",
          type: NotifType.WARNING,
          closeable: false,
          timeout: 5000,
        });

        setTimeout(() => {
          tabChangeNotifRef.current = null;
        }, 5000);
      }
    }
    if (!isFullscreen) {
      if (!fullscreenNotifRef.current) {
        fullscreenNotifRef.current = addNotif({
          title: "Fullscreen",
          body: "Please enter fullscreen to continue the test.",
          type: NotifType.WARNING,
          closeable: false,
        });
      }
    } else {
      if (fullscreenNotifRef.current) {
        removeNotif(fullscreenNotifRef.current);
        fullscreenNotifRef.current = null;
      }
    }
  }, [flags, isFullscreen, isVisible]);

  return {
    flags,
    addFlag,
    removeFlag,
    generateReport,
    makeFullscreen,
  };
}
