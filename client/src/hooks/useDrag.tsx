import React from "react";

export default function useDrag(ref: React.RefObject<any>) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const mouseOffset = React.useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = ref.current?.getBoundingClientRect();
    mouseOffset.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };
    setIsDragging(true);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - mouseOffset.current.x,
        y: e.clientY - mouseOffset.current.y,
      });
    }
  };

  React.useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [isDragging]);

  return {
    onMouseDown: startDrag,
    position,
  };
}
