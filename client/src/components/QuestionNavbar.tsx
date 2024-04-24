import React, { useState, useEffect } from "react";
import Image from "next/image";

const QuestionNavbar = () => {
  const [countdown, setCountdown] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(timer);
          // Handle timer expiration
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown to display minutes and seconds
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900 h-[10vh]">
      <header className="bg-gray-900 text-white py-4 px-6 flex">
        <h1 className="text-2xl font-bold">IIITL Quiz</h1>
        <h3 className="fixed right-[8rem] text-xl">
          Time Remaining: {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}
        </h3>
      </header>
    </div>
  );
};

export default QuestionNavbar;
