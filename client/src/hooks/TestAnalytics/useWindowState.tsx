import React, { useEffect } from "react";

export default function useWindowState() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  const onVisibilityChange = () => {
    setIsVisible(document.visibilityState === "visible");
  };

  const onFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  useEffect(() => {
    document.body.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.body.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const makeFullscreen = () => {
    console.log("Making fullscreen...");
    document.body.requestFullscreen();
  };

  return {
    isFullscreen,
    isVisible,
    makeFullscreen,
  };
}
