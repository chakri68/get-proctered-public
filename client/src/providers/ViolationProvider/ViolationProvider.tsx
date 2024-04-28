import React from "react";
import VIOLATIONS, { ViolationCode } from "./violations";
import Violation from "./Violation";

type ViolationState = {
  code: ViolationCode;
  timestamp: Date;
  severity: "error" | "warning";
};

export const ViolationContext = React.createContext<{
  violations: ViolationState[];
}>({
  violations: [],
});

export default function ViolationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [violations, setViolations] = React.useState<ViolationState[]>([]);

  const handleViolation = (violation: Violation<ViolationCode>) => {
    const newInstance = violation.instances[violation.instances.length - 1];
    setViolations((violations) => [
      ...violations,
      {
        code: violation.code,
        timestamp: newInstance.timestamp,
        severity: newInstance.severity,
      },
    ]);
  };

  React.useEffect(() => {
    VIOLATIONS.forEach((violation) => {
      violation.setup();
      violation.registerCallback(handleViolation);
    });

    return () => {
      VIOLATIONS.forEach((violation) => {
        violation.teardown();
      });
    };
  }, []);

  return (
    <ViolationContext.Provider value={{ violations }}>
      {children}
    </ViolationContext.Provider>
  );
}
