import React, { useState, createContext, useEffect } from "react";

export const ScreenContext = createContext<{
  isFullScreen: boolean;
  makeFullscreen: (el: HTMLElement) => void;
  exitFullscreen: () => void;
}>({
  isFullScreen: false,
  makeFullscreen: () => {},
  exitFullscreen: () => {},
});

export default function ScreenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const handleRightClick = (e: MouseEvent) => {
    e.preventDefault();
  };

  const handleFullScreenChange = () => {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const makeFullscreen = (el: HTMLElement) => {
    if (el.requestFullscreen) {
      el.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  const exitFullscreen = () => {
    setIsFullScreen(false);
    document.exitFullscreen();
  };

  return (
    <ScreenContext.Provider
      value={{ isFullScreen, makeFullscreen, exitFullscreen }}
    >
      {children}
    </ScreenContext.Provider>
  );
}
