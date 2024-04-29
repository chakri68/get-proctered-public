import React, { useContext } from "react";
import VIOLATIONS, { ViolationCode } from "./violations";
import Violation from "./Violation";

type ViolationState = {
  code: ViolationCode;
  timestamp: Date;
  severity: "error" | "warning";
  snapshot?: Blob;
};

export const ViolationContext = React.createContext<{
  violations: ViolationState[];
  startService: () => void;
  stopService: () => void;
  serviceStarted: boolean;
  addViolation: (
    violation: Violation<ViolationCode>["instances"][number] & {
      code: ViolationCode;
      snapshot?: Blob;
    }
  ) => void;
}>({
  violations: [],
  startService: () => {},
  stopService: () => {},
  serviceStarted: false,
  addViolation: () => {},
});

export default function ViolationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [violations, setViolations] = React.useState<ViolationState[]>([]);
  const [startService, setStartService] = React.useState(false);

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

  const startServiceHandler = () => {
    setStartService(true);
  };

  const stopServiceHandler = () => {
    setStartService(false);
  };

  React.useEffect(() => {
    if (startService) {
      VIOLATIONS.forEach((violation) => {
        violation.setup();
        violation.registerCallback(handleViolation);
      });
    } else {
      VIOLATIONS.forEach((violation) => {
        violation.teardown();
      });
    }
  }, [startService]);

  const addViolation = (
    violation: Violation<ViolationCode>["instances"][number] & {
      code: ViolationCode;
      snapshot?: Blob;
    }
  ) => {
    setViolations((violations) => [
      ...violations,
      {
        code: violation.code,
        timestamp: violation.timestamp,
        severity: violation.severity,
        snapshot: violation.snapshot,
      },
    ]);
  };

  return (
    <ViolationContext.Provider
      value={{
        violations,
        startService: startServiceHandler,
        serviceStarted: startService,
        stopService: stopServiceHandler,
        addViolation,
      }}
    >
      {children}
    </ViolationContext.Provider>
  );
}
