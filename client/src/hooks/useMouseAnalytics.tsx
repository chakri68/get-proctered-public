import { useEffect } from "react";

export default function useMouseAnalytics() {
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    console.error("Right click is disabled");
  };

  useEffect(() => {
    window.addEventListener("contextmenu", onContextMenu);

    return () => {
      window.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  return null;
}
