import { ViolationCode } from "./violations";

export default interface Violation<T extends string> {
  code: T;
  setup: () => void;
  teardown: () => void;
  instances: { timestamp: number; severity: "error" | "warning" }[];

  registerCallback: (
    callback: (violation: Violation<ViolationCode>) => void
  ) => void;
}
